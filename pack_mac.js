const packager = require('@electron/packager');

// Ta bom

var options = {
    'arch': 'x64',
    'platform': 'darwin',
    'dir': './logo.icns',
    'appCopyright': 'copyright 2014-2024 Honga Yetu Softwares',
    'appVersion': '1.0',
    'asar': true,
    'icon': './logo.icns',
    'name': 'EI DESKTOP',
    'ignore': ['./releases', './.git'],
    'out': './releases',
    'overwrite': true,
    'prune': true,
    'version': '1.0',
    'version-string':{
        'CompanyName': 'Honga Yetu',
        'FileDescription': 'EI DESKTOP', /*This is what display windows on task manager, shortcut and process*/
        'OriginalFilename': 'EI DESKTOP',
        'ProductName': 'EI DESKTOP',
        'InternalName': 'EI DESKTOP'
    }
};

packager.packager(options);
