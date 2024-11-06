const ReferencesSection = ({ references }) => {
    if (!references?.length) return null;
  
    return (
      <div className="mt-12 bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
        <h2 className="text-2xl font-semibold mb-6 text-white">
          References
        </h2>
        <ul className="space-y-4">
          {references.map((ref, index) => (
            <li 
              key={index} 
              className="flex items-start group transition-all duration-200"
            >
              <span className="text-gray-400 mr-3 mt-0.5 font-mono text-sm">
                [{index + 1}]
              </span>
              <a
                href={ref.referenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 break-all text-sm leading-relaxed group-hover:underline"
              >
                {ref.referenceUrl}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default ReferencesSection;