# 社会计算实验二可视化面板

## Build

```sh
npm install
npm run build
```

## 使用

首先使用 `scrips` 目录下的 `gendata.py` 脚本将 `npz` 文件转换成 `json` 文件，然后在应用中上传 `json` 文件即可看到可视化模型。

```sh
./scripts/gendata.py ./scripts/data_partial.npy > src/data.json
```
