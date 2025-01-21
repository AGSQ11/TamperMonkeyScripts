// ==UserScript==
// @name         IP Address Lookup Tool
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Provides lookup options for selected IP addresses and CIDR subnets
// @author       AGSQ
// @match        *://*/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Add styles with a very high z-index to ensure our popup stays on top
    GM_addStyle(`
        .ip-lookup-popup {
            position: fixed;
            background: #ffffff;
            border: 1px solid #858585;
            border-radius: 2px;
            box-shadow: 2px 2px 2px rgba(0,0,0,0.1);
            padding: 2px;
            z-index: 2147483647;  /* Maximum possible z-index */
            opacity: 0;
            transform: translateY(-2px);
            transition: opacity 0.1s, transform 0.1s;
            font-family: Segoe UI, -apple-system, sans-serif;
            font-size: 12px;
            min-width: 130px;
            pointer-events: auto !important;
        }
        .ip-lookup-popup * {
            pointer-events: auto !important;
        }
        .ip-lookup-popup.visible {
            opacity: 1;
            transform: translateY(0);
        }
        .ip-lookup-option {
            padding: 3px 8px 3px 20px;
            cursor: default;
            white-space: nowrap;
            color: #000000;
            transition: background-color 0.05s;
            position: relative;
            line-height: 16px;
            z-index: 2147483647;
        }
        .ip-lookup-option:hover {
            background-color: #f2f2f2;
            color: #000000;
        }
        .ip-lookup-option:active {
            background-color: #e5e5e5;
        }
        /* Ensure our popup container stays on top */
        #ip-lookup-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2147483647;
        }
    `);

    // Create a container for our popups if it doesn't exist
    function ensureContainer() {
        let container = document.getElementById('ip-lookup-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'ip-lookup-container';
            document.body.appendChild(container);
        }
        return container;
    }

    // Function to validate IP address format
    function isValidIP(str) {
        const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
        const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}(\/\d{1,3})?$/;

        if (!ipv4Pattern.test(str) && !ipv6Pattern.test(str)) {
            return false;
        }

        if (ipv4Pattern.test(str)) {
            const parts = str.split('/')[0].split('.');
            return parts.every(part => parseInt(part) >= 0 && parseInt(part) <= 255);
        }

        return true;
    }

    // Function to get selection coordinates and dimensions
    function getSelectionCoordinates() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return null;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        return {
            top: rect.top,
            bottom: rect.bottom,
            left: rect.left,
            right: rect.right,
            width: rect.width,
            height: rect.height
        };
    }

    // Function to ensure popup stays within viewport
    function adjustPositionToViewport(position, popupWidth, popupHeight) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Adjust horizontal position
        if (position.left + popupWidth > viewportWidth) {
            position.left = viewportWidth - popupWidth - 5;
        }
        if (position.left < 0) {
            position.left = 5;
        }

        // Adjust vertical position
        if (position.top + popupHeight > viewportHeight) {
            position.top = viewportHeight - popupHeight - 5;
        }
        if (position.top < 0) {
            position.top = 5;
        }

        return position;
    }

    // Function to create and show the popup menu
    function showPopup(selectionCoords, ip) {
        const container = ensureContainer();

        // Remove any existing popup
        const existingPopup = document.querySelector('.ip-lookup-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        const popup = document.createElement('div');
        popup.className = 'ip-lookup-popup';

        const options = [
            {
                text: 'Query bgp.he.net',
                url: `https://bgp.he.net/ip/${ip}`
            },
            {
                text: 'Query RIPEDb',
                url: `https://apps.db.ripe.net/db-web-ui/query?searchtext=${ip}`
            }
        ];

        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'ip-lookup-option';
            optionElement.textContent = option.text;
            optionElement.onclick = (e) => {
                e.stopPropagation();
                window.open(option.url, '_blank');
                popup.remove();
            };
            popup.appendChild(optionElement);
        });

        // Add popup to our container instead of body
        container.appendChild(popup);

        // Calculate position
        const popupWidth = popup.offsetWidth;
        const popupHeight = popup.offsetHeight;

        let position = {
            left: selectionCoords.right + 2,
            top: selectionCoords.top
        };

        // Adjust position to ensure popup stays within viewport
        position = adjustPositionToViewport(position, popupWidth, popupHeight);

        // Apply final position
        popup.style.left = `${position.left}px`;
        popup.style.top = `${position.top}px`;

        requestAnimationFrame(() => {
            popup.classList.add('visible');
        });

        // Close popup when clicking outside
        function closePopup(e) {
            if (!popup.contains(e.target)) {
                popup.remove();
                document.removeEventListener('mousedown', closePopup);
            }
        }

        // Delay adding the click listener slightly to prevent immediate closure
        setTimeout(() => {
            document.addEventListener('mousedown', closePopup);
        }, 50);
    }

    // Listen for text selection
    document.addEventListener('mouseup', function(e) {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText && isValidIP(selectedText)) {
            const coords = getSelectionCoordinates();
            if (coords) {
                showPopup(coords, selectedText);
            }
        }
    });
})();
