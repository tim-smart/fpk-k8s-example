import * as K from "@fpk/k8s";
import * as R from "ramda";

export interface IWebWorkloadOpts {
  name: string;
  replicas: number;

  image: string;
  containerPort: number;
  env: K.IEnvObject;
  config: Record<string, string>;

  host: string;
}

export function webWorkload({
  name,
  image,
  replicas,
  containerPort,
  config,
  env,
  host,
}: IWebWorkloadOpts) {
  const configMap = K.configMap("env-config", config);
  const deployment = R.pipe(
    R.always(
      K.deploymentWithContainer({
        name,
        image,
        replicas,
        containerPort,
        env,
      }),
    ),
    K.setDeploymentRollingUpdate({
      maxSurge: "25%",
      maxUnavailable: 2,
    }),
    K.appendContainer({
      name: "super-sidecar",
      image: "myorg/sidecar:v1.0.0",
    }),
    K.overContainer(
      name,
      R.pipe(
        K.appendEnvFromConfigMap(configMap),
        K.setReadinessProbe(),
        K.setLivenessProbe(),
      ),
    ),
  )();

  const service = K.serviceWithPort(name, { app: name }, containerPort);

  const ingress = K.ingressSimple(name, {
    backend: {
      serviceName: name,
      servicePort: containerPort,
    },
    tlsAcme: true,
    tlsRedirect: true,
    tlsSecretName: `${name}-tls`,
    rules: [{ host }],
  });

  return K.withNamespace(name)({
    "10-env-config": configMap,
    "10-deployment": deployment,
    "10-service": service,
    "10-ingress": ingress,
  });
}
