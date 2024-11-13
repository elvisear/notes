import { 
    Avatar, 
    HStack, 
    VStack, 
    Text, 
    MenuButton, 
    Menu, 
    MenuList, 
    MenuOptionGroup, 
    MenuDivider, 
    MenuItem
} from "@chakra-ui/react";
import DrawerUserAvatarStyles from "./DrawerAvatarHeader.module.css";
import { BellRinging } from "phosphor-react";

enum AvatarSize {
    small = "sm",
    medium = "md",
    large = "lg",
    extraLarge = "xl",
    twoExtraLarge = "2xl",
    extraSmall = "xs",
    twoExtraSmall = "2xs"
}

interface UserAvatarProps {
    avatarSize: AvatarSize;
}

const UserAvatar = (props:UserAvatarProps) => {
    return (
        <HStack>
            <Avatar name="Elvis" size={props.avatarSize}/>
            <VStack 
                direction="column"
                textAlign="start"
                alignItems="start" 
                gap={0} 
                mr={1}
            >
                <Text
                    fontSize="small"
                    fontWeight="medium"
                    className="color-text-secondary"
                >
                    Elvis
                </Text>
                <Text
                    fontSize="x-small"
                    className="color-text-subtitle"
                    letterSpacing={0.5}
                    noOfLines={1}
                >
                    elvis@gmail.com
                </Text>
            </VStack>
        </HStack>
    );
};

export default function UserAvatarHeader() {
  return (
    <HStack className={DrawerUserAvatarStyles.userAvatar}>
        <Menu>
            <MenuButton>
                <UserAvatar avatarSize={AvatarSize.small}/>
            </MenuButton>
            {/* Menu List Items*/}
            <MenuList className={DrawerUserAvatarStyles.menuList}>
                <MenuOptionGroup title="Account">
                    <MenuItem 
                        pointerEvents="none" 
                        userSelect="none" 
                        cursor="initial" 
                        disabled
                        background="transparent"
                    >
                        <UserAvatar avatarSize={AvatarSize.extraSmall}/>
                    </MenuItem>
                </MenuOptionGroup>
                <MenuDivider />
                {["Account Info", "Settings", "Notifications", "Sign Out"].map(
                    (list: string, index: number) => (
                        <>
                            <MenuItem key={index + list} color="inherit" className={DrawerUserAvatarStyles.color}>
                                {list}
                            </MenuItem>
                            {list === "Notifications" && index === 3 && <MenuDivider mb={0}/>}
                        </>
                    )
                )}
            </MenuList>
        </Menu>
        <BellRinging className="icon-normal" cursor="pointer"/>
    </HStack>
  );
}
