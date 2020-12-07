import { microservice } from "../lib/microservice";
import * as K from "@fpk/k8s";
import * as Rx from "rxjs";
import * as RxOp from "rxjs/operators";

// This example shows you how you can use pre-existing javascript libraries to
// build configuration.
//
// This file will generate 3 different "apps" using a common structure.

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

const config$ = Rx.from(services).pipe(
  RxOp.flatMap(({ name, version, replicas }) =>
    Rx.of(
      microservice({
        name,
        image: `myorg/${name}:${version}`,
        replicas,
        env: {
          DATABASE_NAME: `${name}_prod`,
        },
      }),
    ).pipe(
      RxOp.map(({ deployment, service, ingress }) => ({
        [`${name}/10-deployment`]: deployment,
        [`${name}/10-service`]: service,
        [`${name}/10-ingress`]: ingress,
      })),
      RxOp.flatMap(K.withNamespace(name, `${name}/00-namespace`)),
    ),
  ),
  RxOp.reduce((acc, config) => ({ ...acc, ...config })),
);

export default Rx.lastValueFrom(config$);
