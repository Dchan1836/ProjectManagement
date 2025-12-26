import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1JGaF5cXGpCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWH1fd3ZVQmhZWUN3VkZWYEs=');
createRoot(document.getElementById("root")!).render(<App />);
