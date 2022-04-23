#!/usr/bin/env python3

import json
import numpy as np
import sys

data = np.load(sys.argv[1])

nodes = set()
edges = []

for i in range(100):
    for j in range(i + 1, 100):
        if data[i][j] > 0:
            nodes.add(i)
            nodes.add(j)
            edges.append({"source": i, "target": j, "value": data[i, j].item()})

print(json.dumps({"nodes": list(nodes), "edges": edges}))
