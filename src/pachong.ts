import superagent from "superagent";
import cheerio from "cheerio";
import fs from "fs";
import path from "path";

interface CoureInfo {
  id: number;
  text: string;
}

class Pachong {
  private url = "https://www.imooc.com"; // 慕课网首页
  constructor() {
    this.getHtml();
  }
  async getHtml() {
    // 获取网站资源，并返回数据
    const res = await superagent.get(this.url);
    const imoocTitleArr: CoureInfo[] = this.getIndexInfo(res.text);
    this.generateJsonContent(imoocTitleArr);
  }
  getIndexInfo(html: string) {
    const $ = cheerio.load(html);
    const navWrap = $(".nav-item");
    let arr: CoureInfo[] = [];
    navWrap.map((index, domEle) => {
      const a_Ele_List = $(domEle).find("a");
      a_Ele_List.map((ind, aEle) => {
        const text = $(aEle).text();
        arr.push({
          id: ind + 1,
          text,
        });
      });
    });
    return arr;
  }
  generateJsonContent(imoocTitleArr: CoureInfo[]) {
    const filePath = path.resolve(__dirname, "../data/course.json");
    let fileContent: CoureInfo[] = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      fileContent = JSON.parse(fileData);
      console.log("-------course.json文件读取成功！-------");
      console.log(fileContent);
    } else {
      fs.writeFileSync(filePath, JSON.stringify(imoocTitleArr), "utf-8");
      console.log("-------course.json文件创建成功！-------");
      console.log(imoocTitleArr);
    }
  }
}

const pc = new Pachong();
