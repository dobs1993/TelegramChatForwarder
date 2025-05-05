// App --> forwarder --> ForwarderCard.tsx

type Props = {
    source: string;
    destination: string;
  };
  
  export default function ForwarderCard({ source, destination }: Props) {
    return (
      <div className="bg-white shadow rounded p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Redirection</h3>
        <p className="text-sm text-gray-600">
          <strong>Source:</strong> {source}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Destination:</strong> {destination}
        </p>
      </div>
    );
  }
  