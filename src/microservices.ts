import { microservice } from "../lib/microservice";
import * as K from "@fpk/k8s";

interface IService {
  name: string;
  version: string;
  replicas: number;
}

const services: IService[] = [
  {
    name: "users",
    version: "latest",
    replicas: 3,
  },
  {
    name: "tenants",
    version: "1.5.0",
    replicas: 5,
  },
  {
    name: "stores",
    version: "1.2.0",
    replicas: 4,
  },
];

export default async () => {
  let config = {};

  for (const { name, version, replicas } of services) {
    const { deployment, service, ingress } = microservice({
      name,
      image: `myorg/${name}:${version}`,
      replicas,
      env: {
        DATABASE_NAME: `${name}_prod`,
      },
    });

    const serviceConfig = await K.withNamespace(
      name,
      `${name}/00-namespace`,
    )({
      [`${name}/10-deployment`]: deployment,
      [`${name}/10-service`]: service,
      [`${name}/10-ingress`]: ingress,
    });

    config = { ...config, ...serviceConfig };
  }

  return config;
};
