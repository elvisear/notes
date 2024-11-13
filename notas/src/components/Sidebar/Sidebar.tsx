import { Box, Container } from "@chakra-ui/react";
import SidebarStyles from "./Sidebar.module.css";
import UserAvatarHeader from "../UserAvatarHeader/UserAvatarHeader";
import DrawerSearch from "../DrawerSearch/DrawerSearch";
import DrawerChips from "../DrawerChips/DrawerChips";
import DrawerNavLinks from "../DrawerNavLinks/DrawerNavLinks";  

export default function Sidebar() {
    return (
      <Container className={SidebarStyles.sidebar} >
        <Box>
          <UserAvatarHeader />
          <DrawerSearch />
          <DrawerChips />
          <DrawerNavLinks />
        </Box>
      </Container>
    )
  }
  