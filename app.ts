import * as rp from 'request-promise';

class App {
    /** 要抽奖的AV号 */
    private avCode: string = '83150477';

    /** 用户名列表 */
    private userNameList: string[] = [];

    constructor() {
        this.userNameList = [];
    }

    async run() {
        let resp = await rp({
            uri: `https://api.bilibili.com/x/v2/reply?pn=1&type=1&oid=${this.avCode}&sort=1&_=${new Date().getTime()}`
        });
        // 翻页信息
        let pageInfo = JSON.parse(resp).data.page;
        let totalPage = Math.ceil(pageInfo.count / pageInfo.size);
        // 爬取每一页用户名字
        for (let i = 1; i <= totalPage; i++) {
            await this.grabPage(i);
        }

        // 抽10个幸运观众
        for (let i = 0; i < 10; i++) {
            this.drawLuckyOne();
        }

    }

    drawLuckyOne() {
        let size = this.userNameList.length;
        let rnd = Math.floor(Math.random() * size);
        let userName = this.userNameList[rnd];
        //取出后从奖池中删除
        delete this.userNameList[rnd];
        console.log(`幸运观众:${userName}`);
    }

    async grabPage(page: number) {
        let resp = await rp({
            uri: `https://api.bilibili.com/x/v2/reply?pn=${page}&type=1&oid=${this.avCode}&sort=1&_=${new Date().getTime()}`
        });
        let replies = JSON.parse(resp).data.replies;
        for (let reply of replies) {
            let userName = reply.member.uname;
            //排除名单
            if (userName !== '游戏老妖'
                && this.userNameList.indexOf(userName) == -1) {
                this.userNameList.push(userName);
            }
        }
    }
}

new App().run();

