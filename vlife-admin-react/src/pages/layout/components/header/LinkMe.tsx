import { Button, Empty, Popover, Tooltip, Image } from "@douyinfe/semi-ui";
import wxImage from "@src/assets/wx.jpg";

export default ({ className }: { className?: string }) => {
  return (
    <div className={`${className} flex`}>
      <Button
        theme="borderless"
        icon={<i className=" icon-qq text-xl text-blue-500 " />}
        style={{
          color: "var(--semi-color-text-2)",
          marginRight: "12px",
        }}
        onClick={() => {
          var qqGroupLink =
            "https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=zznRalE15vpDdHf5BWsBzVo_5A73mC_C&authKey=W5yiKOuVWgPY5UVAIhbiX1nvO62%2Fewf4vnrpi2shCZI7VgOqEsqsfKb7y6xI8qUi&noverify=0&group_code=786134846"; // 替换成你指定的QQ群链接
          window.open(qqGroupLink);
        }}
      >
        <Tooltip content="点击加群786134846"> 点击进QQ群</Tooltip>
      </Button>
      <Popover
        content={
          <Empty
            image={<Image src={wxImage} />}
            title={"微信vlifeboot"}
            description={"技术支持/商务合作"}
            style={{
              width: 200,
              margin: "0 auto",
              display: "flex",
              padding: 5,
            }}
          />
        }
      >
        <Button
          theme="borderless"
          icon={<i className="iconfont icon-weixin text-xl text-green-500 " />}
          style={{
            color: "var(--semi-color-text-2)",
            marginRight: "12px",
          }}
        >
          添加微信
        </Button>
      </Popover>
    </div>
  );
};
