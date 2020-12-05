import { webWorkload } from "./web";
import * as K from "@fpk/k8s";

export interface IMicroserviceOpts {
  name: string;
  image: string;
  replicas: number;
  env: K.IEnvObject;
}

export function microservice({
  name,
  image,
  replicas,
  env,
}: IMicroserviceOpts) {
  return webWorkload({
    name,
    image,
    replicas,
    env: {
      PORT: "3000",
      ...env,
    },
    containerPort: 3000,
    host: `${name}.example.com`,
  });
}
