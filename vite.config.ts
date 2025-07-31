import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// Simple API development plugin
function apiDevPlugin() {
  return {
    name: 'api-dev',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        try {
          const apiPath = req.url.replace('/api/', '')
          const modulePath = `./api/${apiPath.split('?')[0]}.js`
          
          // Dynamic import the API handler
          const { default: handler } = await import(modulePath)
          
          // Parse query parameters into an object like Vercel does
          const urlParams = new URLSearchParams(req.url.split('?')[1] || '')
          const query = {}
          for (const [key, value] of urlParams.entries()) {
            query[key] = value
          }
          
          // Mock req/res objects to match Vercel API format
          const mockReq = {
            query,
            method: req.method,
            headers: req.headers,
            body: req.body
          }
          
          // Ensure environment variables are available
          if (!process.env.IMAGEKIT_PRIVATE_KEY) {
            const fs = await import('fs')
            const path = await import('path')
            try {
              const envContent = fs.readFileSync(path.resolve('.env'), 'utf8')
              const envVars = envContent.split('\n').reduce((acc, line) => {
                const [key, value] = line.split('=')
                if (key && value) acc[key.trim()] = value.trim()
                return acc
              }, {})
              Object.assign(process.env, envVars)
              console.log('Loaded IMAGEKIT_PRIVATE_KEY:', process.env.IMAGEKIT_PRIVATE_KEY ? 'YES' : 'NO')
            } catch (e) {
              console.warn('Could not load .env file:', e.message)
            }
          } else {
            console.log('IMAGEKIT_PRIVATE_KEY already available:', process.env.IMAGEKIT_PRIVATE_KEY ? 'YES' : 'NO')
          }
          
          const mockRes = {
            status: (code) => ({ json: (data) => {
              res.statusCode = code
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
            }}),
            json: (data) => {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
            }
          }
          
          await handler(mockReq, mockRes)
        } catch (error) {
          console.error('API Error:', error)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Internal Server Error' }))
        }
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    apiDevPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  css: {
    devSourcemap: true,
    postcss: './postcss.config.js'
  },
  server: {
    host: true
  },
  build: {
    // Optimize for production
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    // Chunk size optimization
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          ui: ['@headlessui/vue', '@heroicons/vue']
        }
      }
    }
    // Removed minify: 'terser' and terserOptions to use default esbuild
  }
})