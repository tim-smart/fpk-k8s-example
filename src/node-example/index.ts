import * as K from "@fpk/k8s";
import * as R from "ramda";
import * as path from "path";

const name = "node-example";

const configMap = K.configMapFromDir("appdata", path.join(__dirname, ".app"));
const volume = K.volumeFromConfigMap("appdata-volume", configMap);

const appPath = "/var/lib/app";
const port = 80;
const container = K.containerWithPort("my-app", "node:14-alpine", 80, {
  command: ["node", "index.js", `${port}`],
  workingDir: appPath,
});
const deployment = R.pipe(
  () => K.deploymentWithContainer(name, container),
  K.appendVolumeAndMount({
    volume,
    mountPath: appPath,
  }),
)();

const service = K.serviceFromPod("app-svc", deployment);
const ingress = K.ingressFromService("app-ing", ["app.example.com"], service);

export default K.withNamespace(name)({
  "10-appdata": configMap,
  "20-deployment": deployment,
  "20-service": service,
  "20-ingress": ingress,
});
