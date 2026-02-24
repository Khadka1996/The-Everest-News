export default function LoadingSkeleton({ type }) {
    const skeletons = {
      video: (
        <div className="w-full h-64 bg-gray-100 animate-pulse rounded-lg" />
      ),
      footer: (
        <div className="h-40 bg-gray-50 animate-pulse mt-8" />
      ),
      heading: (
        <div className="h-16 bg-gray-100 animate-pulse my-4" />
      ),
      default: (
        <div className="w-full h-32 bg-gray-100 animate-pulse" />
      )
    };
  
    return skeletons[type] || skeletons.default;
  }