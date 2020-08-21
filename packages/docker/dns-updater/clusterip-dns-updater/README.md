# thrashplay/clusterip-dns-updater
DNS updater utility that updates DNS records and cluster configuration to expose ClusterIP services using a public
DNS name. This cluster configuration is used by non-prod Thrashplay GKE clusters in order to avoid having to create 
(and pay for) a load balancer for such setups.

Since the public DNS will point to a single node in the cluster, this configuration does not provide any HA guarantees
and there will be service downtime if that specific node is taken offline (for maintenance or other reasons.)

## Configuration
This service is configured by creating a ConfigMap with the name `dns-updater-cm` in the same namespace as the Pod.
This namespace must have a `configuration` key, which is a Yaml file in the specified format:

```yaml
hosts:
  - host1.example.com
  - "*.others.example.com"
services:
  my-namespace:
    - service1
    - service2
  other-namespace:
    - exposed-service
```

The `hosts` key is an array of strings, each of which is a host name pattern. Each pattern will have a Cloudflare
DNS record updated (or created) whenever the cluster's external IP address changes. The `services` key contains an
object that has a key containing names of Namespaces in the cluster. Each Namespace key contains a list of services
in that Namespace. Each Service contained in this collection will have its `externalIPs` configuration value updated
to contain the cluster's internal IP address. This configuration allows services on GKE Nodes to respond to traffic
that is routed to the cluster's public-facing IP address.