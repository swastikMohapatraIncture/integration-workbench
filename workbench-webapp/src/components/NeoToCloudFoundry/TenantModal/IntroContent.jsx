const IntroContent = () => {
  return (
    <div className="">
      <div>
        <h2 className="text-xl">Welcome to the Tenant Setup Wizard</h2>
        <p className="mt-2">
          This wizard will guide you through the setup process to connect NEO to CF with Jacana
        </p>
      </div>
      <div className="mt-5">
        <ul className="flex flex-col gap-2">
          <li>
            <p>Step 1: Introduction</p>
            <p className="text-xs text-gray-500">
              Provides the guidelines to configure and connect NEO and CF
              with Jacana.
            </p>
          </li>
          <li>
            <p>Step 2: NEO</p>
            <p className="text-xs text-gray-500">
              Configure Jacana to connect with the NEO tenant and test
              connectivity.
            </p>
          </li>
          <li>
            <p>Step 3: Cloud Foundry</p>
            <p className="text-xs text-gray-500">
              Configure Jacana to connect with the CF tenant and test
              connectivity.
            </p>
          </li>
          <li>
            <p>Step 4: Cloud Foundry API</p>
            <p className="text-xs text-gray-500">
              Configure Jacana to connect with the CF tenant and test
              connectivity.
            </p>
          </li>
        </ul>
      </div>
      <div className="mt-5">
        <p>
          Follow these steps using the &ldquo;Next&rdquo; and &ldquo;Back&rdquo; buttons to smoothly
          transition from your existing NEO system to the
          Cloud Foundry Platform. Integration and leverage API
          integrations to supercharge your business operations.
        </p>
      </div>
    </div>
  );
};

export default IntroContent;
