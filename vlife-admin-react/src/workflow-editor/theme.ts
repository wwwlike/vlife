export interface IThemeToken {
  colorBorder?: string;
  colorBorderSecondary?: string;
  colorBgContainer?: string;
  colorText?: string;
  colorTextSecondary?: string;
  colorBgBase?: string;
  colorPrimary?: string;
  colorError?: string;
  colorSuccess?: string;
}

//styled-components 的typescript使用
export interface IDefaultTheme{
  token?: IThemeToken
  mode?: 'dark' | 'light'
}