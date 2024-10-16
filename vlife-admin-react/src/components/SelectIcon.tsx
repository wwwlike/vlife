import _ from "lodash";
import cx from "classnames";
import {
  IconAbsoluteStroked as IconAbsoluteStroked,
  IconActivity as IconActivity,
  IconAlarm as IconAlarm,
  IconAlertCircle as IconAlertCircle,
  IconAlertTriangle as IconAlertTriangle,
  IconAlignBottom as IconAlignBottom,
  IconAlignCenter as IconAlignCenter,
  IconAlignCenterVertical as IconAlignCenterVertical,
  IconAlignHCenterStroked as IconAlignHCenterStroked,
  IconAlignHLeftStroked as IconAlignHLeftStroked,
  IconAlignHRightStroked as IconAlignHRightStroked,
  IconAlignJustify as IconAlignJustify,
  IconAlignLeft as IconAlignLeft,
  IconAlignRight as IconAlignRight,
  IconAlignTop as IconAlignTop,
  IconAlignVBotStroked as IconAlignVBotStroked,
  IconAlignVBottomStroked as IconAlignVBottomStroked,
  IconAlignVCenterStroked as IconAlignVCenterStroked,
  IconAlignVTopStroked as IconAlignVTopStroked,
  IconApartment as IconApartment,
  IconAppCenter as IconAppCenter,
  IconApps as IconApps,
  IconArchive as IconArchive,
  IconArrowDown as IconArrowDown,
  IconArrowDownLeft as IconArrowDownLeft,
  IconArrowDownRight as IconArrowDownRight,
  IconArrowLeft as IconArrowLeft,
  IconArrowRight as IconArrowRight,
  IconArrowUp as IconArrowUp,
  IconArrowUpLeft as IconArrowUpLeft,
  IconArrowUpRight as IconArrowUpRight,
  IconArticle as IconArticle,
  IconAscend as IconAscend,
  IconAt as IconAt,
  IconBackTop as IconBackTop,
  IconBackward as IconBackward,
  IconBarChartHStroked as IconBarChartHStroked,
  IconBarChartVStroked as IconBarChartVStroked,
  IconBeaker as IconBeaker,
  IconBell as IconBell,
  IconBellStroked as IconBellStroked,
  IconBold as IconBold,
  IconBolt as IconBolt,
  IconBookH5Stroked as IconBookH5Stroked,
  IconBookOpenStroked as IconBookOpenStroked,
  IconBookStroked as IconBookStroked,
  IconBookmark as IconBookmark,
  IconBookmarkAddStroked as IconBookmarkAddStroked,
  IconBookmarkDeleteStroked as IconBookmarkDeleteStroked,
  IconBottomCenterStroked as IconBottomCenterStroked,
  IconBottomLeftStroked as IconBottomLeftStroked,
  IconBottomRightStroked as IconBottomRightStroked,
  IconBox as IconBox,
  IconBrackets as IconBrackets,
  IconBranch as IconBranch,
  IconBriefStroked as IconBriefStroked,
  IconBriefcase as IconBriefcase,
  IconBulb as IconBulb,
  IconButtonStroked as IconButtonStroked,
  IconBytedanceLogo as IconBytedanceLogo,
  IconCalendar as IconCalendar,
  IconCalendarClock as IconCalendarClock,
  IconCalendarStroked as IconCalendarStroked,
  IconCamera as IconCamera,
  IconCandlestickChartStroked as IconCandlestickChartStroked,
  IconCaretdown as IconCaretdown,
  IconCaretup as IconCaretup,
  IconCarouselStroked as IconCarouselStroked,
  IconCart as IconCart,
  IconCaseSensitive as IconCaseSensitive,
  IconCenterLeftStroked as IconCenterLeftStroked,
  IconCenterRightStroked as IconCenterRightStroked,
  IconChainStroked as IconChainStroked,
  IconCheckChoiceStroked as IconCheckChoiceStroked,
  IconCheckCircleStroked as IconCheckCircleStroked,
  IconCheckList as IconCheckList,
  IconCheckboxIndeterminate as IconCheckboxIndeterminate,
  IconCheckboxTick as IconCheckboxTick,
  IconChecklistStroked as IconChecklistStroked,
  IconChevronDown as IconChevronDown,
  IconChevronDownStroked as IconChevronDownStroked,
  IconChevronLeft as IconChevronLeft,
  IconChevronRight as IconChevronRight,
  IconChevronRightStroked as IconChevronRightStroked,
  IconChevronUp as IconChevronUp,
  IconChevronUpDown as IconChevronUpDown,
  IconClear as IconClear,
  IconClock as IconClock,
  IconClose as IconClose,
  IconCloud as IconCloud,
  IconCloudStroked as IconCloudStroked,
  IconCloudUploadStroked as IconCloudUploadStroked,
  IconCode as IconCode,
  IconCodeStroked as IconCodeStroked,
  IconCoinMoneyStroked as IconCoinMoneyStroked,
  IconColorPalette as IconColorPalette,
  IconColumnsStroked as IconColumnsStroked,
  IconCommand as IconCommand,
  IconComment as IconComment,
  IconCommentStroked as IconCommentStroked,
  IconComponent as IconComponent,
  IconComponentPlaceholderStroked as IconComponentPlaceholderStroked,
  IconComponentStroked as IconComponentStroked,
  IconConfigStroked as IconConfigStroked,
  IconConnectionPoint1 as IconConnectionPoint1,
  IconConnectionPoint2 as IconConnectionPoint2,
  IconContrast as IconContrast,
  IconCopy as IconCopy,
  IconCopyAdd as IconCopyAdd,
  IconCopyStroked as IconCopyStroked,
  IconCornerRadiusStroked as IconCornerRadiusStroked,
  IconCreditCard as IconCreditCard,
  IconCrop as IconCrop,
  IconCrossCircleStroked as IconCrossCircleStroked,
  IconCrossStroked as IconCrossStroked,
  IconCrown as IconCrown,
  IconCustomerSupport as IconCustomerSupport,
  IconCustomerSupportStroked as IconCustomerSupportStroked,
  IconCustomize as IconCustomize,
  IconDelete as IconDelete,
  IconDeleteStroked as IconDeleteStroked,
  IconDescend as IconDescend,
  IconDescend2 as IconDescend2,
  IconDesktop as IconDesktop,
  IconDisc as IconDisc,
  IconDislikeThumb as IconDislikeThumb,
  IconDivide as IconDivide,
  IconDongchediLogo as IconDongchediLogo,
  IconDoubleChevronLeft as IconDoubleChevronLeft,
  IconDoubleChevronRight as IconDoubleChevronRight,
  IconDownCircleStroked as IconDownCircleStroked,
  IconDownload as IconDownload,
  IconDownloadStroked as IconDownloadStroked,
  IconDuration as IconDuration,
  IconEdit as IconEdit,
  IconEdit2Stroked as IconEdit2Stroked,
  IconEditStroked as IconEditStroked,
  IconElementStroked as IconElementStroked,
  IconEmoji as IconEmoji,
  IconExit as IconExit,
  IconExpand as IconExpand,
  IconExport as IconExport,
  IconExternalOpen as IconExternalOpen,
  IconExternalOpenStroked as IconExternalOpenStroked,
  IconEyeClosed as IconEyeClosed,
  IconEyeClosedSolid as IconEyeClosedSolid,
  IconEyeOpened as IconEyeOpened,
  IconFacebook as IconFacebook,
  IconFaceuLogo as IconFaceuLogo,
  IconFastForward as IconFastForward,
  IconFastFoward as IconFastFoward,
  IconFavoriteList as IconFavoriteList,
  IconFeishuLogo as IconFeishuLogo,
  IconFemale as IconFemale,
  IconFigma as IconFigma,
  IconFile as IconFile,
  IconFillStroked as IconFillStroked,
  IconFilledArrowDown as IconFilledArrowDown,
  IconFilledArrowUp as IconFilledArrowUp,
  IconFilpVertical as IconFilpVertical,
  IconFilter as IconFilter,
  IconFingerLeftStroked as IconFingerLeftStroked,
  IconFixedStroked as IconFixedStroked,
  IconFlag as IconFlag,
  IconFlipHorizontal as IconFlipHorizontal,
  IconFlowChartStroked as IconFlowChartStroked,
  IconFolder as IconFolder,
  IconFolderOpen as IconFolderOpen,
  IconFolderStroked as IconFolderStroked,
  IconFollowStroked as IconFollowStroked,
  IconFont as IconFont,
  IconFontColor as IconFontColor,
  IconForward as IconForward,
  IconForwardStroked as IconForwardStroked,
  IconFullScreenStroked as IconFullScreenStroked,
  IconGallery as IconGallery,
  IconGift as IconGift,
  IconGiftStroked as IconGiftStroked,
  IconGit as IconGit,
  IconGithubLogo as IconGithubLogo,
  IconGitlabLogo as IconGitlabLogo,
  IconGlobe as IconGlobe,
  IconGlobeStroke as IconGlobeStroke,
  IconGridRectangle as IconGridRectangle,
  IconGridSquare as IconGridSquare,
  IconGridStroked as IconGridStroked,
  IconGridView as IconGridView,
  IconGridView1 as IconGridView1,
  IconH1 as IconH1,
  IconH2 as IconH2,
  IconH3 as IconH3,
  IconH4 as IconH4,
  IconH5 as IconH5,
  IconH6 as IconH6,
  IconH7 as IconH7,
  IconH8 as IconH8,
  IconH9 as IconH9,
  IconHandle as IconHandle,
  IconHash as IconHash,
  IconHeartStroked as IconHeartStroked,
  IconHelm as IconHelm,
  IconHelpCircle as IconHelpCircle,
  IconHelpCircleStroked as IconHelpCircleStroked,
  IconHistogram as IconHistogram,
  IconHistory as IconHistory,
  IconHn as IconHn,
  IconHome as IconHome,
  IconHomeStroked as IconHomeStroked,
  IconHorn as IconHorn,
  IconHourglass as IconHourglass,
  IconHourglassStroked as IconHourglassStroked,
  IconIdCard as IconIdCard,
  IconIdentity as IconIdentity,
  IconImage as IconImage,
  IconImageStroked as IconImageStroked,
  IconImport as IconImport,
  IconInbox as IconInbox,
  IconIndenpentCornersStroked as IconIndenpentCornersStroked,
  IconIndentLeft as IconIndentLeft,
  IconIndentRight as IconIndentRight,
  IconIndependentCornersStroked as IconIndependentCornersStroked,
  IconInfoCircle as IconInfoCircle,
  IconInherit as IconInherit,
  IconInheritStroked as IconInheritStroked,
  IconInnerSectionStroked as IconInnerSectionStroked,
  IconInstagram as IconInstagram,
  IconInteractiveStroked as IconInteractiveStroked,
  IconInviteStroked as IconInviteStroked,
  IconIssueStroked as IconIssueStroked,
  IconItalic as IconItalic,
  IconJianying as IconJianying,
  IconKanban as IconKanban,
  IconKey as IconKey,
  IconKeyStroked as IconKeyStroked,
  IconLanguage as IconLanguage,
  IconLayers as IconLayers,
  IconLeftCircleStroked as IconLeftCircleStroked,
  IconLightningStroked as IconLightningStroked,
  IconLikeHeart as IconLikeHeart,
  IconLikeThumb as IconLikeThumb,
  IconLineChartStroked as IconLineChartStroked,
  IconLineHeight as IconLineHeight,
  IconLink as IconLink,
  IconList as IconList,
  IconListView as IconListView,
  IconLive as IconLive,
  IconLoading as IconLoading,
  IconLock as IconLock,
  IconLockStroked as IconLockStroked,
  IconLoopTextStroked as IconLoopTextStroked,
  IconMail as IconMail,
  IconMailStroked as IconMailStroked,
  IconMailStroked1 as IconMailStroked1,
  IconMale as IconMale,
  IconMapPin as IconMapPin,
  IconMapPinStroked as IconMapPinStroked,
  IconMarginLeftStroked as IconMarginLeftStroked,
  IconMarginStroked as IconMarginStroked,
  IconMark as IconMark,
  IconMaximize as IconMaximize,
  IconMember as IconMember,
  IconMenu as IconMenu,
  IconMicrophone as IconMicrophone,
  IconMicrophoneOff as IconMicrophoneOff,
  IconMinimize as IconMinimize,
  IconMinus as IconMinus,
  IconMinusCircle as IconMinusCircle,
  IconMinusCircleStroked as IconMinusCircleStroked,
  IconMinusStroked as IconMinusStroked,
  IconModalStroked as IconModalStroked,
  IconMoneyExchangeStroked as IconMoneyExchangeStroked,
  IconMonitorStroked as IconMonitorStroked,
  IconMoon as IconMoon,
  IconMore as IconMore,
  IconMoreStroked as IconMoreStroked,
  IconMusic as IconMusic,
  IconMusicNoteStroked as IconMusicNoteStroked,
  IconMute as IconMute,
  IconNineGridStroked as IconNineGridStroked,
  IconNoteMoneyStroked as IconNoteMoneyStroked,
  IconOption as IconOption,
  IconOrderedList as IconOrderedList,
  IconOrderedListStroked as IconOrderedListStroked,
  IconPaperclip as IconPaperclip,
  IconPause as IconPause,
  IconPercentage as IconPercentage,
  IconPhone as IconPhone,
  IconPhoneStroke as IconPhoneStroke,
  IconPieChart2Stroked as IconPieChart2Stroked,
  IconPieChartStroked as IconPieChartStroked,
  IconPiechartH5Stroked as IconPiechartH5Stroked,
  IconPipixiaLogo as IconPipixiaLogo,
  IconPlay as IconPlay,
  IconPlayCircle as IconPlayCircle,
  IconPlus as IconPlus,
  IconPlusCircle as IconPlusCircle,
  IconPlusCircleStroked as IconPlusCircleStroked,
  IconPlusStroked as IconPlusStroked,
  IconPriceTag as IconPriceTag,
  IconPrint as IconPrint,
  IconPrizeStroked as IconPrizeStroked,
  IconPulse as IconPulse,
  IconPuzzle as IconPuzzle,
  IconQingyan as IconQingyan,
  IconQrCode as IconQrCode,
  IconQuit as IconQuit,
  IconQuote as IconQuote,
  IconRadio as IconRadio,
  IconRankingCardStroked as IconRankingCardStroked,
  IconRealSizeStroked as IconRealSizeStroked,
  IconRedo as IconRedo,
  IconRedoStroked as IconRedoStroked,
  IconRefresh as IconRefresh,
  IconRefresh2 as IconRefresh2,
  IconRegExp as IconRegExp,
  IconReply as IconReply,
  IconReplyStroked as IconReplyStroked,
  IconResso as IconResso,
  IconRestart as IconRestart,
  IconRingChartStroked as IconRingChartStroked,
  IconRotate as IconRotate,
  IconRotationStroked as IconRotationStroked,
  IconRoute as IconRoute,
  IconRowsStroked as IconRowsStroked,
  IconSafe as IconSafe,
  IconSave as IconSave,
  IconSaveStroked as IconSaveStroked,
  IconScan as IconScan,
  IconScissors as IconScissors,
  IconSearch as IconSearch,
  IconSearchStroked as IconSearchStroked,
  IconSectionStroked as IconSectionStroked,
  IconSemiLogo as IconSemiLogo,
  IconSend as IconSend,
  IconSendMsgStroked as IconSendMsgStroked,
  IconSendStroked as IconSendStroked,
  IconServer as IconServer,
  IconServerStroked as IconServerStroked,
  IconSetting as IconSetting,
  IconSettingStroked as IconSettingStroked,
  IconShareMoneyStroked as IconShareMoneyStroked,
  IconShareStroked as IconShareStroked,
  IconShield as IconShield,
  IconShieldStroked as IconShieldStroked,
  IconShift as IconShift,
  IconShoppingBag as IconShoppingBag,
  IconShrink as IconShrink,
  IconShrinkScreenStroked as IconShrinkScreenStroked,
  IconSidebar as IconSidebar,
  IconSignal as IconSignal,
  IconSimilarity as IconSimilarity,
  IconSmallTriangleDown as IconSmallTriangleDown,
  IconSmallTriangleLeft as IconSmallTriangleLeft,
  IconSmallTriangleRight as IconSmallTriangleRight,
  IconSmallTriangleTop as IconSmallTriangleTop,
  IconSmartphoneCheckStroked as IconSmartphoneCheckStroked,
  IconSmartphoneStroked as IconSmartphoneStroked,
  IconSong as IconSong,
  IconSonicStroked as IconSonicStroked,
  IconSort as IconSort,
  IconSortStroked as IconSortStroked,
  IconSourceControl as IconSourceControl,
  IconSpin as IconSpin,
  IconStackBarChartStroked as IconStackBarChartStroked,
  IconStar as IconStar,
  IconStarStroked as IconStarStroked,
  IconStop as IconStop,
  IconStopwatchStroked as IconStopwatchStroked,
  IconStoryStroked as IconStoryStroked,
  IconStrikeThrough as IconStrikeThrough,
  IconSun as IconSun,
  IconSync as IconSync,
  IconTabArrowStroked as IconTabArrowStroked,
  IconTabsStroked as IconTabsStroked,
  IconTaskMoneyStroked as IconTaskMoneyStroked,
  IconTemplate as IconTemplate,
  IconTemplateStroked as IconTemplateStroked,
  IconTerminal as IconTerminal,
  IconTestScoreStroked as IconTestScoreStroked,
  IconText as IconText,
  IconTextRectangle as IconTextRectangle,
  IconTextStroked as IconTextStroked,
  IconThumbUpStroked as IconThumbUpStroked,
  IconTick as IconTick,
  IconTickCircle as IconTickCircle,
  IconTicketCodeExchangeStroked as IconTicketCodeExchangeStroked,
  IconTicketCodeStroked as IconTicketCodeStroked,
  IconTiktokLogo as IconTiktokLogo,
  IconTop as IconTop,
  IconTopCenterStroked as IconTopCenterStroked,
  IconTopLeftStroked as IconTopLeftStroked,
  IconTopRightStroked as IconTopRightStroked,
  IconTopbuzzLogo as IconTopbuzzLogo,
  IconToutiaoLogo as IconToutiaoLogo,
  IconTransparentStroked as IconTransparentStroked,
  IconTreeTriangleDown as IconTreeTriangleDown,
  IconTreeTriangleRight as IconTreeTriangleRight,
  IconTriangleArrow as IconTriangleArrow,
  IconTriangleArrowVertical as IconTriangleArrowVertical,
  IconTriangleDown as IconTriangleDown,
  IconTriangleUp as IconTriangleUp,
  IconTrueFalseStroked as IconTrueFalseStroked,
  IconTvCheckedStroked as IconTvCheckedStroked,
  IconTwitter as IconTwitter,
  IconTypograph as IconTypograph,
  IconUnChainStroked as IconUnChainStroked,
  IconUnderline as IconUnderline,
  IconUndo as IconUndo,
  IconUnlink as IconUnlink,
  IconUnlock as IconUnlock,
  IconUnlockStroked as IconUnlockStroked,
  IconUpload as IconUpload,
  IconUploadError as IconUploadError,
  IconUser as IconUser,
  IconUserAdd as IconUserAdd,
  IconUserCardPhone as IconUserCardPhone,
  IconUserCardVideo as IconUserCardVideo,
  IconUserCircle as IconUserCircle,
  IconUserCircleStroked as IconUserCircleStroked,
  IconUserGroup as IconUserGroup,
  IconUserListStroked as IconUserListStroked,
  IconUserSetting as IconUserSetting,
  IconUserStroked as IconUserStroked,
  IconVennChartStroked as IconVennChartStroked,
  IconVerify as IconVerify,
  IconVersionStroked as IconVersionStroked,
  IconVideo as IconVideo,
  IconVideoDouyinStroked as IconVideoDouyinStroked,
  IconVideoListStroked as IconVideoListStroked,
  IconVideoStroked as IconVideoStroked,
  IconVideoUrlStroked as IconVideoUrlStroked,
  IconVigoLogo as IconVigoLogo,
  IconVolume1 as IconVolume1,
  IconVolume2 as IconVolume2,
  IconVolumnSilent as IconVolumnSilent,
  IconVoteStroked as IconVoteStroked,
  IconVoteVideoStroked as IconVoteVideoStroked,
  IconWeibo as IconWeibo,
  IconWholeWord as IconWholeWord,
  IconWifi as IconWifi,
  IconWindowAdaptionStroked as IconWindowAdaptionStroked,
  IconWrench as IconWrench,
  IconXiguaLogo as IconXiguaLogo,
  IconYoutube as IconYoutube,
} from "@douyinfe/semi-icons";
import {
  Button,
  Card,
  Dropdown,
  TabPane,
  Tabs,
  Tooltip,
} from "@douyinfe/semi-ui";
import { useUpdateEffect } from "ahooks";
import React, {
  ElementType,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { VfBaseProps } from "@src/dsl/component";

interface SelectIconProps extends VfBaseProps<string> {
  size:
    | "inherit"
    | "extra-small"
    | "small"
    | "default"
    | "large"
    | "extra-large";
  tooltip: string;
}

export const IconRender = (icon: ReactNode | string) => {
  if (typeof icon === "string") {
    if (icon.startsWith("Icon")) {
      const Icon: any = icons[icon];
      return <Icon />;
    } else {
      return <i className={icon} />;
    }
  }
  return icon;
};

export const icons: { [key: string]: ElementType } = {
  IconAbsoluteStroked: IconAbsoluteStroked,
  IconActivity: IconActivity,
  IconAlarm: IconAlarm,
  IconAlertCircle: IconAlertCircle,
  IconAlertTriangle: IconAlertTriangle,
  IconAlignBottom: IconAlignBottom,
  IconAlignCenter: IconAlignCenter,
  IconAlignCenterVertical: IconAlignCenterVertical,
  IconAlignHCenterStroked: IconAlignHCenterStroked,
  IconAlignHLeftStroked: IconAlignHLeftStroked,
  IconAlignHRightStroked: IconAlignHRightStroked,
  IconAlignJustify: IconAlignJustify,
  IconAlignLeft: IconAlignLeft,
  IconAlignRight: IconAlignRight,
  IconAlignTop: IconAlignTop,
  IconAlignVBotStroked: IconAlignVBotStroked,
  IconAlignVBottomStroked: IconAlignVBottomStroked,
  IconAlignVCenterStroked: IconAlignVCenterStroked,
  IconAlignVTopStroked: IconAlignVTopStroked,
  IconApartment: IconApartment,
  IconAppCenter: IconAppCenter,
  IconApps: IconApps,
  IconArchive: IconArchive,
  IconArrowDown: IconArrowDown,
  IconArrowDownLeft: IconArrowDownLeft,
  IconArrowDownRight: IconArrowDownRight,
  IconArrowLeft: IconArrowLeft,
  IconArrowRight: IconArrowRight,
  IconArrowUp: IconArrowUp,
  IconArrowUpLeft: IconArrowUpLeft,
  IconArrowUpRight: IconArrowUpRight,
  IconArticle: IconArticle,
  IconAscend: IconAscend,
  IconAt: IconAt,
  IconBackTop: IconBackTop,
  IconBackward: IconBackward,
  IconBarChartHStroked: IconBarChartHStroked,
  IconBarChartVStroked: IconBarChartVStroked,
  IconBeaker: IconBeaker,
  IconBell: IconBell,
  IconBellStroked: IconBellStroked,
  IconBold: IconBold,
  IconBolt: IconBolt,
  IconBookH5Stroked: IconBookH5Stroked,
  IconBookOpenStroked: IconBookOpenStroked,
  IconBookStroked: IconBookStroked,
  IconBookmark: IconBookmark,
  IconBookmarkAddStroked: IconBookmarkAddStroked,
  IconBookmarkDeleteStroked: IconBookmarkDeleteStroked,
  IconBottomCenterStroked: IconBottomCenterStroked,
  IconBottomLeftStroked: IconBottomLeftStroked,
  IconBottomRightStroked: IconBottomRightStroked,
  IconBox: IconBox,
  IconBrackets: IconBrackets,
  IconBranch: IconBranch,
  IconBriefStroked: IconBriefStroked,
  IconBriefcase: IconBriefcase,
  IconBulb: IconBulb,
  IconButtonStroked: IconButtonStroked,
  IconBytedanceLogo: IconBytedanceLogo,
  IconCalendar: IconCalendar,
  IconCalendarClock: IconCalendarClock,
  IconCalendarStroked: IconCalendarStroked,
  IconCamera: IconCamera,
  IconCandlestickChartStroked: IconCandlestickChartStroked,
  IconCaretdown: IconCaretdown,
  IconCaretup: IconCaretup,
  IconCarouselStroked: IconCarouselStroked,
  IconCart: IconCart,
  IconCaseSensitive: IconCaseSensitive,
  IconCenterLeftStroked: IconCenterLeftStroked,
  IconCenterRightStroked: IconCenterRightStroked,
  IconChainStroked: IconChainStroked,
  IconCheckChoiceStroked: IconCheckChoiceStroked,
  IconCheckCircleStroked: IconCheckCircleStroked,
  IconCheckList: IconCheckList,
  IconCheckboxIndeterminate: IconCheckboxIndeterminate,
  IconCheckboxTick: IconCheckboxTick,
  IconChecklistStroked: IconChecklistStroked,
  IconChevronDown: IconChevronDown,
  IconChevronDownStroked: IconChevronDownStroked,
  IconChevronLeft: IconChevronLeft,
  IconChevronRight: IconChevronRight,
  IconChevronRightStroked: IconChevronRightStroked,
  IconChevronUp: IconChevronUp,
  IconChevronUpDown: IconChevronUpDown,
  IconClear: IconClear,
  IconClock: IconClock,
  IconClose: IconClose,
  IconCloud: IconCloud,
  IconCloudStroked: IconCloudStroked,
  IconCloudUploadStroked: IconCloudUploadStroked,
  IconCode: IconCode,
  IconCodeStroked: IconCodeStroked,
  IconCoinMoneyStroked: IconCoinMoneyStroked,
  IconColorPalette: IconColorPalette,
  IconColumnsStroked: IconColumnsStroked,
  IconCommand: IconCommand,
  IconComment: IconComment,
  IconCommentStroked: IconCommentStroked,
  IconComponent: IconComponent,
  IconComponentPlaceholderStroked: IconComponentPlaceholderStroked,
  IconComponentStroked: IconComponentStroked,
  IconConfigStroked: IconConfigStroked,
  IconConnectionPoint1: IconConnectionPoint1,
  IconConnectionPoint2: IconConnectionPoint2,
  IconContrast: IconContrast,
  IconCopy: IconCopy,
  IconCopyAdd: IconCopyAdd,
  IconCopyStroked: IconCopyStroked,
  IconCornerRadiusStroked: IconCornerRadiusStroked,
  IconCreditCard: IconCreditCard,
  IconCrop: IconCrop,
  IconCrossCircleStroked: IconCrossCircleStroked,
  IconCrossStroked: IconCrossStroked,
  IconCrown: IconCrown,
  IconCustomerSupport: IconCustomerSupport,
  IconCustomerSupportStroked: IconCustomerSupportStroked,
  IconCustomize: IconCustomize,
  IconDelete: IconDelete,
  IconDeleteStroked: IconDeleteStroked,
  IconDescend: IconDescend,
  IconDescend2: IconDescend2,
  IconDesktop: IconDesktop,
  IconDisc: IconDisc,
  IconDislikeThumb: IconDislikeThumb,
  IconDivide: IconDivide,
  IconDongchediLogo: IconDongchediLogo,
  IconDoubleChevronLeft: IconDoubleChevronLeft,
  IconDoubleChevronRight: IconDoubleChevronRight,
  IconDownCircleStroked: IconDownCircleStroked,
  IconDownload: IconDownload,
  IconDownloadStroked: IconDownloadStroked,
  IconDuration: IconDuration,
  IconEdit: IconEdit,
  IconEdit2Stroked: IconEdit2Stroked,
  IconEditStroked: IconEditStroked,
  IconElementStroked: IconElementStroked,
  IconEmoji: IconEmoji,
  IconExit: IconExit,
  IconExpand: IconExpand,
  IconExport: IconExport,
  IconExternalOpen: IconExternalOpen,
  IconExternalOpenStroked: IconExternalOpenStroked,
  IconEyeClosed: IconEyeClosed,
  IconEyeClosedSolid: IconEyeClosedSolid,
  IconEyeOpened: IconEyeOpened,
  IconFacebook: IconFacebook,
  IconFaceuLogo: IconFaceuLogo,
  IconFastForward: IconFastForward,
  IconFastFoward: IconFastFoward,
  IconFavoriteList: IconFavoriteList,
  IconFeishuLogo: IconFeishuLogo,
  IconFemale: IconFemale,
  IconFigma: IconFigma,
  IconFile: IconFile,
  IconFillStroked: IconFillStroked,
  IconFilledArrowDown: IconFilledArrowDown,
  IconFilledArrowUp: IconFilledArrowUp,
  IconFilpVertical: IconFilpVertical,
  IconFilter: IconFilter,
  IconFingerLeftStroked: IconFingerLeftStroked,
  IconFixedStroked: IconFixedStroked,
  IconFlag: IconFlag,
  IconFlipHorizontal: IconFlipHorizontal,
  IconFlowChartStroked: IconFlowChartStroked,
  IconFolder: IconFolder,
  IconFolderOpen: IconFolderOpen,
  IconFolderStroked: IconFolderStroked,
  IconFollowStroked: IconFollowStroked,
  IconFont: IconFont,
  IconFontColor: IconFontColor,
  IconForward: IconForward,
  IconForwardStroked: IconForwardStroked,
  IconFullScreenStroked: IconFullScreenStroked,
  IconGallery: IconGallery,
  IconGift: IconGift,
  IconGiftStroked: IconGiftStroked,
  IconGit: IconGit,
  IconGithubLogo: IconGithubLogo,
  IconGitlabLogo: IconGitlabLogo,
  IconGlobe: IconGlobe,
  IconGlobeStroke: IconGlobeStroke,
  IconGridRectangle: IconGridRectangle,
  IconGridSquare: IconGridSquare,
  IconGridStroked: IconGridStroked,
  IconGridView: IconGridView,
  IconGridView1: IconGridView1,
  IconH1: IconH1,
  IconH2: IconH2,
  IconH3: IconH3,
  IconH4: IconH4,
  IconH5: IconH5,
  IconH6: IconH6,
  IconH7: IconH7,
  IconH8: IconH8,
  IconH9: IconH9,
  IconHandle: IconHandle,
  IconHash: IconHash,
  IconHeartStroked: IconHeartStroked,
  IconHelm: IconHelm,
  IconHelpCircle: IconHelpCircle,
  IconSearch: IconSearch,
  IconHelpCircleStroked: IconHelpCircleStroked,
  IconHistogram: IconHistogram,
  IconHistory: IconHistory,
  IconHn: IconHn,
  IconHome: IconHome,
  IconHomeStroked: IconHomeStroked,
  IconHorn: IconHorn,
  IconHourglass: IconHourglass,
  IconHourglassStroked: IconHourglassStroked,
  IconIdCard: IconIdCard,
  IconIdentity: IconIdentity,
  IconImage: IconImage,
  IconImageStroked: IconImageStroked,
  IconImport: IconImport,
  IconInbox: IconInbox,
  IconIndenpentCornersStroked: IconIndenpentCornersStroked,
  IconIndentLeft: IconIndentLeft,
  IconIndentRight: IconIndentRight,
  IconIndependentCornersStroked: IconIndependentCornersStroked,
  IconInfoCircle: IconInfoCircle,
  IconInherit: IconInherit,
  IconInheritStroked: IconInheritStroked,
  IconInnerSectionStroked: IconInnerSectionStroked,
  IconInstagram: IconInstagram,
  IconInteractiveStroked: IconInteractiveStroked,
  IconInviteStroked: IconInviteStroked,
  IconIssueStroked: IconIssueStroked,
  IconItalic: IconItalic,
  IconJianying: IconJianying,
  IconKanban: IconKanban,
  IconKey: IconKey,
  IconKeyStroked: IconKeyStroked,
  IconLanguage: IconLanguage,
  IconLayers: IconLayers,
  IconLeftCircleStroked: IconLeftCircleStroked,
  IconLightningStroked: IconLightningStroked,
  IconLikeHeart: IconLikeHeart,
  IconLikeThumb: IconLikeThumb,
  IconLineChartStroked: IconLineChartStroked,
  IconLineHeight: IconLineHeight,
  IconLink: IconLink,
  IconList: IconList,
  IconListView: IconListView,
  IconLive: IconLive,
  IconLoading: IconLoading,
  IconLock: IconLock,
  IconLockStroked: IconLockStroked,
  IconLoopTextStroked: IconLoopTextStroked,
  IconMail: IconMail,
  IconMailStroked: IconMailStroked,
  IconMailStroked1: IconMailStroked1,
  IconMale: IconMale,
  IconMapPin: IconMapPin,
  IconMapPinStroked: IconMapPinStroked,
  IconMarginLeftStroked: IconMarginLeftStroked,
  IconMarginStroked: IconMarginStroked,
  IconMark: IconMark,
  IconMaximize: IconMaximize,
  IconMember: IconMember,
  IconMenu: IconMenu,
  IconMicrophone: IconMicrophone,
  IconMicrophoneOff: IconMicrophoneOff,
  IconMinimize: IconMinimize,
  IconMinus: IconMinus,
  IconMinusCircle: IconMinusCircle,
  IconMinusCircleStroked: IconMinusCircleStroked,
  IconMinusStroked: IconMinusStroked,
  IconModalStroked: IconModalStroked,
  IconMoneyExchangeStroked: IconMoneyExchangeStroked,
  IconMonitorStroked: IconMonitorStroked,
  IconMoon: IconMoon,
  IconMore: IconMore,
  IconMoreStroked: IconMoreStroked,
  IconMusic: IconMusic,
  IconMusicNoteStroked: IconMusicNoteStroked,
  IconMute: IconMute,
  IconNineGridStroked: IconNineGridStroked,
  IconNoteMoneyStroked: IconNoteMoneyStroked,
  IconOption: IconOption,
  IconOrderedList: IconOrderedList,
  IconOrderedListStroked: IconOrderedListStroked,
  IconPaperclip: IconPaperclip,
  IconPause: IconPause,
  IconPercentage: IconPercentage,
  IconPhone: IconPhone,
  IconPhoneStroke: IconPhoneStroke,
  IconPieChart2Stroked: IconPieChart2Stroked,
  IconPieChartStroked: IconPieChartStroked,
  IconPiechartH5Stroked: IconPiechartH5Stroked,
  IconPipixiaLogo: IconPipixiaLogo,
  IconPlay: IconPlay,
  IconPlayCircle: IconPlayCircle,
  IconPlus: IconPlus,
  IconPlusCircle: IconPlusCircle,
  IconPlusCircleStroked: IconPlusCircleStroked,
  IconPlusStroked: IconPlusStroked,
  IconPriceTag: IconPriceTag,
  IconPrint: IconPrint,
  IconPrizeStroked: IconPrizeStroked,
  IconPulse: IconPulse,
  IconPuzzle: IconPuzzle,
  IconQingyan: IconQingyan,
  IconQrCode: IconQrCode,
  IconQuit: IconQuit,
  IconQuote: IconQuote,
  IconRadio: IconRadio,
  IconRankingCardStroked: IconRankingCardStroked,
  IconRealSizeStroked: IconRealSizeStroked,
  IconRedo: IconRedo,
  IconRedoStroked: IconRedoStroked,
  IconRefresh: IconRefresh,
  IconRefresh2: IconRefresh2,
  IconRegExp: IconRegExp,
  IconReply: IconReply,
  IconReplyStroked: IconReplyStroked,
  IconResso: IconResso,
  IconRestart: IconRestart,
  IconRingChartStroked: IconRingChartStroked,
  IconRotate: IconRotate,
  IconRotationStroked: IconRotationStroked,
  IconRoute: IconRoute,
  IconRowsStroked: IconRowsStroked,
  IconSafe: IconSafe,
  IconSave: IconSave,
  IconSaveStroked: IconSaveStroked,
  IconScan: IconScan,
  IconScissors: IconScissors,
  IconSearchStroked: IconSearchStroked,
  IconSectionStroked: IconSectionStroked,
  IconSemiLogo: IconSemiLogo,
  IconSend: IconSend,
  IconSendMsgStroked: IconSendMsgStroked,
  IconSendStroked: IconSendStroked,
  IconServer: IconServer,
  IconServerStroked: IconServerStroked,
  IconSetting: IconSetting,
  IconSettingStroked: IconSettingStroked,
  IconShareMoneyStroked: IconShareMoneyStroked,
  IconShareStroked: IconShareStroked,
  IconShield: IconShield,
  IconShieldStroked: IconShieldStroked,
  IconShift: IconShift,
  IconShoppingBag: IconShoppingBag,
  IconShrink: IconShrink,
  IconShrinkScreenStroked: IconShrinkScreenStroked,
  IconSidebar: IconSidebar,
  IconSignal: IconSignal,
  IconSimilarity: IconSimilarity,
  IconSmallTriangleDown: IconSmallTriangleDown,
  IconSmallTriangleLeft: IconSmallTriangleLeft,
  IconSmallTriangleRight: IconSmallTriangleRight,
  IconSmallTriangleTop: IconSmallTriangleTop,
  IconSmartphoneCheckStroked: IconSmartphoneCheckStroked,
  IconSmartphoneStroked: IconSmartphoneStroked,
  IconSong: IconSong,
  IconSonicStroked: IconSonicStroked,
  IconSort: IconSort,
  IconSortStroked: IconSortStroked,
  IconSourceControl: IconSourceControl,
  IconSpin: IconSpin,
  IconStackBarChartStroked: IconStackBarChartStroked,
  IconStar: IconStar,
  IconStarStroked: IconStarStroked,
  IconStop: IconStop,
  IconStopwatchStroked: IconStopwatchStroked,
  IconStoryStroked: IconStoryStroked,
  IconStrikeThrough: IconStrikeThrough,
  IconSun: IconSun,
  IconSync: IconSync,
  IconTabArrowStroked: IconTabArrowStroked,
  IconTabsStroked: IconTabsStroked,
  IconTaskMoneyStroked: IconTaskMoneyStroked,
  IconTemplate: IconTemplate,
  IconTemplateStroked: IconTemplateStroked,
  IconTerminal: IconTerminal,
  IconTestScoreStroked: IconTestScoreStroked,
  IconText: IconText,
  IconTextRectangle: IconTextRectangle,
  IconTextStroked: IconTextStroked,
  IconThumbUpStroked: IconThumbUpStroked,
  IconTick: IconTick,
  IconTickCircle: IconTickCircle,
  IconTicketCodeExchangeStroked: IconTicketCodeExchangeStroked,
  IconTicketCodeStroked: IconTicketCodeStroked,
  IconTiktokLogo: IconTiktokLogo,
  IconTop: IconTop,
  IconTopCenterStroked: IconTopCenterStroked,
  IconTopLeftStroked: IconTopLeftStroked,
  IconTopRightStroked: IconTopRightStroked,
  IconTopbuzzLogo: IconTopbuzzLogo,
  IconToutiaoLogo: IconToutiaoLogo,
  IconTransparentStroked: IconTransparentStroked,
  IconTreeTriangleDown: IconTreeTriangleDown,
  IconTreeTriangleRight: IconTreeTriangleRight,
  IconTriangleArrow: IconTriangleArrow,
  IconTriangleArrowVertical: IconTriangleArrowVertical,
  IconTriangleDown: IconTriangleDown,
  IconTriangleUp: IconTriangleUp,
  IconTrueFalseStroked: IconTrueFalseStroked,
  IconTvCheckedStroked: IconTvCheckedStroked,
  IconTwitter: IconTwitter,
  IconTypograph: IconTypograph,
  IconUnChainStroked: IconUnChainStroked,
  IconUnderline: IconUnderline,
  IconUndo: IconUndo,
  IconUnlink: IconUnlink,
  IconUnlock: IconUnlock,
  IconUnlockStroked: IconUnlockStroked,
  IconUpload: IconUpload,
  IconUploadError: IconUploadError,
  IconUser: IconUser,
  IconUserAdd: IconUserAdd,
  IconUserCardPhone: IconUserCardPhone,
  IconUserCardVideo: IconUserCardVideo,
  IconUserCircle: IconUserCircle,
  IconUserCircleStroked: IconUserCircleStroked,
  IconUserGroup: IconUserGroup,
  IconUserListStroked: IconUserListStroked,
  IconUserSetting: IconUserSetting,
  IconUserStroked: IconUserStroked,
  IconVennChartStroked: IconVennChartStroked,
  IconVerify: IconVerify,
  IconVersionStroked: IconVersionStroked,
  IconVideo: IconVideo,
  IconVideoDouyinStroked: IconVideoDouyinStroked,
  IconVideoListStroked: IconVideoListStroked,
  IconVideoStroked: IconVideoStroked,
  IconVideoUrlStroked: IconVideoUrlStroked,
  IconVigoLogo: IconVigoLogo,
  IconVolume1: IconVolume1,
  IconVolume2: IconVolume2,
  IconVolumnSilent: IconVolumnSilent,
  IconVoteStroked: IconVoteStroked,
  IconVoteVideoStroked: IconVoteVideoStroked,
  IconWeibo: IconWeibo,
  IconWholeWord: IconWholeWord,
  IconWifi: IconWifi,
  IconWindowAdaptionStroked: IconWindowAdaptionStroked,
  IconWrench: IconWrench,
  IconXiguaLogo: IconXiguaLogo,
  IconYoutube: IconYoutube,
};
/**
 * 图标选择组件
 */
const SelectIcon = ({
  value,
  tooltip,
  size = "default",
  onDataChange,
  read,
  ...props
}: Partial<SelectIconProps>) => {
  const [selected, setSelected] = useState<string>();

  useEffect(() => {
    setSelected(value);
  }, [value]);
  const menuRef = useRef(null);
  /**
   * 每100条记录放入一个对象
   */
  const tabIcons = useMemo((): { [key: string]: ElementType }[] => {
    const iconArray: { [key: string]: ElementType }[] = [];
    const keyArray: string[][] = _.chunk(Object.keys(icons), 100);
    keyArray.forEach((arr: string[]) => {
      const obj: { [key: string]: ElementType } = {};
      arr.forEach((key) => {
        obj[key] = icons[key];
      });
      iconArray.push(obj);
    });

    return iconArray;
  }, [icons]);

  useUpdateEffect(() => {
    if (onDataChange && selected) {
      // alert(selected);
      onDataChange(selected);
    }
  }, [selected]);

  const VfIcon = useMemo(() => {
    if (selected && read) {
      const IconComponent = icons[selected];
      if (IconComponent) {
        return <IconComponent size={size} {...props} />;
      } else {
        return <div>-</div>;
      }
    } else if (selected) {
      const IconComponent = icons[selected];
      return (
        <div className=" space-x-3">
          <Tooltip content="点击替换">
            <IconComponent size={size} {...props} />
          </Tooltip>
        </div>
      );
    } else if (read) {
      return <div className=" space-x-3">-</div>;
    } else {
      return <Button icon={<IconSearch />}>选择</Button>;
    }
  }, [selected]);

  return read ? (
    tooltip ? (
      <Tooltip content={tooltip}>{VfIcon}</Tooltip>
    ) : (
      <> {VfIcon}</>
    )
  ) : (
    <Dropdown
      ref={menuRef}
      trigger={"click"} //点击触发
      clickToHide={true}
      stopPropagation={true}
      className={`${props.className} border-2  items-center justify-center`}
      render={
        <div className=" w-96 h-96 overflow-x-auto">
          <ul className="bg-slate-100 p-4  grid grid-cols-12 space-x-2 space-y-2">
            {selected && (
              <li
                className=" col-span-2 hover:text-blue-400 cursor-pointer "
                onClick={() => {
                  setSelected("");
                }}
              >
                <b>置空</b>
              </li>
            )}
            {Object.keys(icons).map((key, index2) => {
              const IconComponent = icons[key];
              return (
                <li
                  key={index2}
                  className=" hover:text-blue-500"
                  onClick={() => {
                    setSelected(key);
                  }}
                >
                  <Tooltip content={key}>
                    <IconComponent size={size} {...props} />
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </div>
      }
    >
      {VfIcon}
    </Dropdown>
  );
};

export default SelectIcon;
