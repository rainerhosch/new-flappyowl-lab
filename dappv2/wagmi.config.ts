import { defineConfig } from '@wagmi/cli'
import { hardhat} from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'src/smartcontract-abi.ts',
  plugins: [
    hardhat({
      artifacts: '../smartcontract/artifacts', 
      project: '../smartcontract',
      exclude: [ 
        // the following patterns are excluded by default 
        'build-info/**', 
        '*.dbg.json', 
      ], 
    }),
  ],
})
