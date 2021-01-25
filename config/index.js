/**
 * @file 主配置文件
 * @author Iain
 * @email znjmails@qq.com
 * @creation 2019/10/25
 */
import devConfig from "./dev.env.js";
import prodConfig from "./prod.env.js";

export default process.env.NODE_ENV === "development" ? devConfig : prodConfig;
