import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import AutoUnpackNativesPlugin from "@electron-forge/plugin-auto-unpack-natives";

const config: ForgeConfig = {
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'adriano461997',
          name: 'ei-desktop'
        },
      }
    }
  ],
  packagerConfig: {
    icon: 'imagens/logo', // no file extension required,
    asar: true // or an object containing your asar options
  },
    // ...

  rebuildConfig: {},

  makers: [
   new MakerSquirrel({
    setupIcon: "imagens/logo.ico",
    copyright: "copyright Escola Inteligente 2023-2024",
    authors: "Honga Yetu",
    name: "EI-DESKTOP",
  }),
  new MakerZIP({}, ['darwin']),
  //new MakerRpm({}),
  //new MakerDeb({}),
  ],

  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    new AutoUnpackNativesPlugin({

    })
  ],
};

export default config;
