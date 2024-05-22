const IntroContent = () => {
  return (
    <div className="">
      <div>
        <h2 className="text-xl">Welcome to the Tenant Setup Wizard</h2>
        <p className="mt-2">
          This wizard will guide you through the setup process to connect PO 7.5
          and IS tenants with Integration Workbench
        </p>
      </div>
      <div className="mt-5">
        <ul className="flex flex-col gap-2">
          <li>
            <p>Step 1: Introduction</p>
            <p className="text-xs text-gray-500">
              Provides the guidelines to configure and connect PO 7.5 and IS
              with Integration Workbench.
            </p>
          </li>
          <li>
            <p>Step 2: Process Orchestration</p>
            <p className="text-xs text-gray-500">
              Configure Integration Workbench to connect with the PO 7.5 tenant and test
              connectivity.
            </p>
          </li>
          <li>
            <p>Step 3: SAP Integration Suite</p>
            <p className="text-xs text-gray-500">
              Configure Integration Workbench to connect with the IS tenant and test
              connectivity.
            </p>
          </li>
          <li>
            <p>Step 4: Integration Suite API</p>
            <p className="text-xs text-gray-500">
              Configure Integration Workbench to connect with the IS tenant and test
              connectivity.
            </p>
          </li>
        </ul>
      </div>
      <div className="mt-5">
        <p>
          Follow these steps using the &ldquo;Next&rdquo; and &ldquo;Back&rdquo; buttons to smoothly
          transition from your existing Process Orchestration system to the
          Integration Suite Cloud Platform. Integration and leverage API
          integrations to supercharge your business operations.
        </p>
      </div>
    </div>
  );
};

export default IntroContent;
