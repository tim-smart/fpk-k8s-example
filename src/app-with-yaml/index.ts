import * as K from "@fpk/k8s";
import { webWorkload } from "../../lib/web";

// This example has standard yaml files living alongside our fpk configuration.
//
// It also uses the index file pattern, which prevents fpk from creating a
// seperate "index" sub-directory.

const { configMap, deployment, service, ingress } = webWorkload({
  name: "app-with-yaml",
  replicas: 2,

  image: "myorg/another-web-app:latest",
  containerPort: 3000,
  env: {},
  config: { key: "value" },

  host: "yaml.example.com",
});

export default K.withNamespace("app-with-yaml")({
  "10-config": configMap,
  "20-deploy": deployment,
  "20-svc": service,
  "20-ing": ingress,
});
