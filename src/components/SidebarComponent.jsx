'use client';

import React, { useState } from 'react';
import { Menu, MenuItem, Sidebar, SubMenu, sidebarClasses } from 'react-pro-sidebar';
import { FaUser, FaUserCircle, FaHome, FaSignOutAlt } from 'react-icons/fa';

const SidebarComponent = ({ isCollapsed, onMenuIconClick }) => {
  //   const useEmail = user?.email;

  return (
    <Sidebar
      collapsed={isCollapsed}
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          backgroundColor: '#fff',
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
        [`.${sidebarClasses.root}`]: {
          color: '#000',
        },
      }}
    >
      <Menu>
        <MenuItem>
          <div className='flex mt-4 text-gray-500 font-bold text-sm px-5 justify-between'>{isCollapsed ? '' : 'Overview'}</div>
        </MenuItem>
        <MenuItem icon={<FaHome />}>
          <div>App</div>
        </MenuItem>
        <MenuItem>
          <div className='flex mt-4 text-gray-500 font-bold text-sm px-5 justify-between'>{isCollapsed ? '' : 'Management'}</div>
        </MenuItem>
        <SubMenu label='User' icon={<FaUser />}>
          <MenuItem>
            <div>Profile</div>
          </MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
};

export default SidebarComponent;
