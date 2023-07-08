import { MenuItemType, SubMenuType, MenuItemGroupType, MenuDividerType } from 'antd/es/menu/hooks/useItems';

export interface IMenuItems  {
    items?: ItemType[]
}

export type ItemType = OwnMenuItemType | OwnSubMenuType | OwnMenuItemGroupType | OwnMenuDividerType | null;

interface OwnMenuItemType extends MenuItemType{
    module: 'seo' | 'crypto' | null
}

interface OwnSubMenuType extends SubMenuType{
    module: 'seo' | 'crypto' | null
}

interface OwnMenuItemGroupType extends MenuItemGroupType{
    module: 'seo' | 'crypto' | null
}

interface OwnMenuDividerType extends MenuDividerType{
    module: 'seo' | 'crypto' | null
}