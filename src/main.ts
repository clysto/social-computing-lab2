import './style.css';
import Graph from 'graphology';
import ForceSupervisor from 'graphology-layout-force/worker';
import demoData from './data.json';
import Sigma from 'sigma';

interface Edge {
  source: Number;
  target: Number;
  value: Number;
}

let data = demoData;

const $file = document.querySelector('#file') as HTMLInputElement;
const $search = document.querySelector('#search') as HTMLInputElement;
const $start = document.querySelector('#start') as HTMLElement;
const $reset = document.querySelector('#reset') as HTMLElement;
const $path = document.querySelector('#path') as HTMLElement;
const container = document.getElementById('sigma-container') as HTMLElement;

function fillData(
  graph: Graph,
  nodes: Array<Number> | Set<Number>,
  edges: Array<Edge>
) {
  graph.clear();
  for (let node of nodes) {
    graph.addNode(node, {
      x: Math.random(),
      y: Math.random(),
      size: 5,
      label: `Person ${node}`,
      color: 'blue',
    });
  }
  for (let edge of edges) {
    graph.addEdge(edge.source, edge.target, {
      type: 'line',
      label: `${edge.value.toFixed(3)}`,
      size: 1,
    });
  }
}

// 创建画布
const graph = new Graph();
fillData(graph, data.nodes, data.edges);

// 布局
const layout = new ForceSupervisor(graph, {
  isNodeFixed: (_, attr) => attr.highlighted,
});
layout.start();

// 渲染到 DOM
const renderer = new Sigma(graph, container, {
  renderEdgeLabels: true,
});

let draggedNode: string | null = null;
let isDragging = false;

renderer.on('downNode', (e) => {
  isDragging = true;
  draggedNode = e.node;
  graph.setNodeAttribute(draggedNode, 'highlighted', true);
});

renderer.getMouseCaptor().on('mousemovebody', (e) => {
  if (!isDragging || !draggedNode) return;

  const pos = renderer.viewportToGraph(e);

  graph.setNodeAttribute(draggedNode, 'x', pos.x);
  graph.setNodeAttribute(draggedNode, 'y', pos.y);

  e.preventSigmaDefault();
  e.original.preventDefault();
  e.original.stopPropagation();
});

renderer.getMouseCaptor().on('mouseup', () => {
  if (draggedNode) {
    graph.removeNodeAttribute(draggedNode, 'highlighted');
  }
  isDragging = false;
  draggedNode = null;
});

renderer.getMouseCaptor().on('mousedown', () => {
  if (!renderer.getCustomBBox()) renderer.setCustomBBox(renderer.getBBox());
});

$start.addEventListener('click', () => {
  const value = $search.value;
  const idx = value
    .split(',')
    .map((s) => parseInt(s))
    .filter((s) => s);
  graph.clear();
  let edges: Array<Edge> = [];
  edges = [
    ...data.edges.filter(
      (e) => idx.includes(e.source) || idx.includes(e.target)
    ),
  ];

  const nodes = new Set([
    ...edges.map((e) => e.source),
    ...edges.map((e) => e.target),
  ]);
  fillData(graph, nodes, edges);
});

$reset.addEventListener('click', () => {
  $search.value = '';
  fillData(graph, data.nodes, data.edges);
});

$file.addEventListener('change', async () => {
  if ($file.files) {
    const file = $file.files[0];
    const content = await file.text();
    try {
      const parsed = JSON.parse(content);
      data = parsed;
      $path.innerText = file.name;
      fillData(graph, data.nodes, data.edges);
    } catch (e) {
      alert('JSON 解析错误!');
    }
  }
});
