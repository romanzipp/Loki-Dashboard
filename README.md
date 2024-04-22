# Loki Dashboard

An alternative **Dashboard** Frontend and **Logs Browser** for [Grafana Loki](https://grafana.com/oss/loki/).

![Screenshot](art/screenshot-01-light.png#gh-light-mode-only)
![Screenshot](art/screenshot-01-dark.png#gh-dark-mode-only)

### Features

- See all ingested into Loki
- Automatic fetching of **labels** & handy filtering
- Store current filter **state in URL**, set bookmarks for dashboards
- Parsing of **exceptions** & additonal data
- Customizable UI
- Deploy as **Docker** container
- Dark mode

## Setup

The project is built as a [Docker container](https://github.com/romanzipp/Loki-Dashboard/pkgs/container/loki-dashboard) via the GitHub `ghcr.io` container registry.

### Docker

The default port `3000` will be expoed.

```
docker pull ghcr.io/romanzipp/loki-dashboard:latest
```

```
docker run -e "LOKI_ENTRYPOINT=http://localhost:3100" -p 3000:3000 romanzipp/loki-dashboard:latest
```

### Nomad (with Docker)

```hcl
job "loki" {
  group "loki-dashboard" {
    network {
      mode = "bridge"

      port "http" {
        to = 3000
      }
    }

    service {
      name = "loki-dashboard"
      port = "http"

      connect {
        sidecar_service {
          proxy {
            upstreams {
              destination_name = "loki" # <- your Grafana Loki service name
              local_bind_port  = 3100
            }
          }
        }
      }
    }

    task "loki-dashboard" {
      driver = "docker"

      config {
        image = "ghcr.io/romanzipp/loki-dashboard:latest"
        ports = ["http"]
      }

      env {
        LOKI_ENTRYPOINT = "http://${NOMAD_UPSTREAM_ADDR_loki}"
      }
    }
  }
  
  group "loki" {
    # ...
  }
}
```

## Configuration

#### `LOKI_ENTRYPOINT` (default: `http://localhost:3100`)

The Loki instance base url.

#### `COLORED_ROWS` (default: false)

Color rows with the according level color.

#### `COLORED_ROWS_LEVEL_THRESHOLD` (default: null)

If `COLORED_ROWS` is enabled, only add background to rows with a level larger or equal than the set value.

#### `LABEL_CHAR_LIMIT` (default: 26)

Maximum limit of characters after which to truncate the label text

## License

[MIT License](LICENSE.md)

## Authors

- [Roman Zipp](https://romanzipp.com)

