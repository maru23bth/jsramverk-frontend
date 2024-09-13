export default (phase) => {
    const isBuild = phase === 'phase-production-build'
    
    /** @type {import('next').NextConfig} */
    const nextConfig = {
      output: 'export', // Export the project to static (SPA)
      basePath: isBuild ? '/~maru23/editor': undefined, // Set the base path for the project to work on student.bth.se
      images: { unoptimized: true }, // Disable image optimization to work with output export
    }
    return nextConfig
  }