import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import SideBar from '../components/SideBar';

// clean up renderer after each test
afterEach(()=>{
    cleanup();
});

test('render sidebar', () => {
  render(<SideBar 
    collapsed={false} 
    handleToggleSidebar={()=>{}} 
    locales={{'Deutsch': 'de-DE'}} 
    localeChanged={()=>{}} 
    locationFromChanged={()=>{}} 
    travelModeChanged={()=>{}}
    locationStopOversChanged={()=>{}}
    routeInfos={
        {
            distance: 35.8, 
            duration: 12.8, 
            incidence: 234.56, 
            municipalities: [
                {   index: 0, 
                    municipality: {
                        bfs_nr: 3544,
                        canton: 'GR',
                        incidence: 203
                    }
                }
            ]
        }
    }
    locationToChanged={()=>{}}
    rtl={false}
    toggled={false}  
  />);
  const sidebarElement = screen.getByTestId('sidebar-1');
  expect(sidebarElement).toBeInTheDocument();
});
