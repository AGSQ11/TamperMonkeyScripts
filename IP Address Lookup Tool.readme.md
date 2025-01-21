# IP Address Lookup Tool

A Tampermonkey userscript that adds a convenient context menu for quick IP address and CIDR subnet lookups.

## Features

- Automatically detects selected IP addresses and CIDR subnets
- Shows a compact Windows-style context menu
- Provides quick access to common IP lookup services:
  - bgp.he.net
  - RIPE Database
  - RaDB
- Works with both IPv4 and IPv6 addresses
- Supports CIDR notation
- Smart positioning to avoid screen edges and other popups
- Non-intrusive design that integrates with any webpage

## Installation

1. Install the [Tampermonkey](https://www.tampermonkey.net/) browser extension for your browser:
   - [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
   - [Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089)

2. Create a new script in Tampermonkey
3. Copy the entire script content
4. Save the script

## Usage

1. Select any IP address or CIDR subnet on any webpage
2. A small context menu will appear next to your selection
3. Choose from:
   - "Query bgp.he.net" to look up the IP on Hurricane Electric's BGP Toolkit
   - "Query RIPEDb" to search the IP in the RIPE Database
   - "Query RADb" to look up the IP in the Routing Assets Database
4. The lookup will open in a new tab

## Supported Formats

- IPv4 addresses (e.g., `192.168.1.1`)
- IPv4 with CIDR notation (e.g., `192.168.1.0/24`)
- IPv6 addresses (e.g., `2001:0db8:85a3:0000:0000:8a2e:0370:7334`)
- IPv6 with CIDR notation (e.g., `2001:0db8:85a3:0000:0000:8a2e:0370:7334/64`)

## Technical Details

### Key Features

- Automatic IP address and CIDR subnet detection
- Smart positioning system that avoids viewport edges
- High z-index (2147483647) to ensure visibility
- Dedicated container to prevent interference with page elements
- Smooth appearance animation
- Windows-style context menu appearance

### Browser Compatibility

The script should work in all modern browsers that support Tampermonkey, including:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

## Contributing

Feel free to open issues or submit pull requests if you have suggestions for improvements or bug fixes.

## License

This script is available under the MIT License. Feel free to modify and distribute it as needed.
