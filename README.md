# Image Flow

In development.

## Demo

**Graph Workspace**

<img width="1511" alt="image-flow-graph-complex-demo" src="https://github.com/artizon-io/image-flow/assets/86842365/f1e87e83-a1f1-445b-99bb-2fc2d3c73012">

**Table Workspace**

<img width="1511" alt="image-flow-table-demo" src="https://github.com/artizon-io/image-flow/assets/86842365/fe45d301-e717-4bfe-836b-4e66e8a693b3">

## Roadmap

On the way...

**Query Language Support + High Performance Table**

- [SurrealDB](https://surrealdb.com/)

**High Performance Graph UI**

- [wasm-bindgen web-sys Canvas/WebGL](https://rustwasm.github.io/wasm-bindgen/examples/2d-canvas.html)
- [ThreeJS]()
- [PubSubJS](https://github.com/mroderick/PubSubJS)
- [graph-data-structure](https://github.com/datavis-tech/graph-data-structure)
- [react-digraph](https://github.com/uber/react-digraph)
- [solid-element](https://giancarlobuomprisco.com/solid/building-widgets-solidjs-web-components)
- [solid-motion-one](https://motion.dev/solid/quick-start)
- [leptos](https://leptos-rs.github.io/leptos/)

---

In backlog...

**UI Animations**

**Fallback UI**
- Provide fallback UI for uncaught errors

**Table Virtualization**
- Only render visible rows

**Code Editor Workspace**
- User should be able to edit prompt, SQL, or any other text through the code editor workspace
- [monaco](https://www.npmjs.com/package/@monaco-editor/react)

**Query as Graph Node**
- A new graph node type that allows user to incorporate his local database of images (w/ metadata) into the graph workspace

**Graphs Management**

- Ability to save/load graph configurations

**Model, Lora Version and Download Management**
- A new workspace for managing SD models. Fetch model info from HF and CivitAI?

**Graph Node Evaluation**

**Renderer (Automatic1111, InvokeAI, ComfyUI) Connectors**
- [Automatic1111](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
- [InvokeAI](https://github.com/invoke-ai)
- [ComfyUI](https://github.com/comfyanonymous/ComfyUI)

**Aspect Ratio Graph Node**
- A new graph node type (more like a variant of the existing `Number Pair`) that lets user choose the aspect ratio

**Language Model Graph Node (OpenAI)**
- A new graph node type that connects to language models

**Table Sort, Filter, & Search w/ Simple UI**
- e.g. Support for sorting a column of numbers by clicking an arrow in the column header?
- e.g. Support for filtering through a column by regex?

**Custom Meteadata**
- Support for saving external metadata of an image in the local database
- An example usecase of external metadata would be user rating/favourites

**Composite Graph Node**
- User should be able to convert a connected subgraph to a single node aka composite graph node. This graph node would have the same set of inputs and outputs as the subgraph
- User should be able to save/load these composite graph nodes

**Data Visualization**
- Rename the `Table` workspace -> `Data` workspace
- [React-charts](https://react-charts.tanstack.com/)
- A variety of charts and diagrams should be available to the user inside this worksace

**Graph Operations History**
- Keep track of the recent modifications applied to the graph such that operations can be undo/redo
- Optionally save checkpoints along the way such that user can revert back to a previous state

**Graph Extension Support (Custom Nodes)**
- Allow developers to write their own custom nodes
- A new workspace for managing user's grpah extensions

**CivitAI Graph Node**
- A new graph node type that allow user to query images hosted on CivitAI through its image api

**Graph Batch Processing Support**
- Allow user to evaluate the graph in a batch

**Textual Inversions Support**

**Hypernetworks Support**

**ControlNet Support**

**Built-in Renderer**
- As an alternative to Automatic1111, ComfyUI, etc
- Built-in renderer's integration with the graph workspace is most native, hence more features would be available?

**Collaboration / Multi-player**
- [Liveblocks zustand middleware](https://liveblocks.io/docs/api-reference/liveblocks-zustand)

**Cloud/Non-local Renderer**

**Mobile Support**

**Built-in Paint Node (to support Mask, Outpaint, Image Bash)**

**Segmentation (use in combination w/ Paint Canvas; like PS magic wind)**

**Tag Autocomplete**
