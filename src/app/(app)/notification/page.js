"use client";
import React, { useEffect, useState } from "react";
import Header from "../Header";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import { useNotification } from "@/hooks/api/useNotification";
import useEcho from "@/hooks/useEcho";
import { useAuth } from "@/hooks/auth";
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Howl, Howler } from "howler";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    transformOrigin={{ vertical: "top", horizontal: "right" }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: "rgb(55, 65, 81)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
}));

export default function Page() {
  const [count, setCount] = useState(null);
  const [notificationData, setNotificationData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false); // Track if audio is unlocked
  const { index: getCount } = useNotification("count");
  const { index: getNotifications } = useNotification();
  const echo = useEcho();
  const { user } = useAuth({ middleware: "auth" });

  // Initialize sound
  const [sound] = useState(
    new Howl({
      src: ["/notifSound.mp3"],
      preload: true, // Preload the sound
    })
  );

  const fetchCount = async () => {
    const { data } = await getCount();
    data && setCount(data.data);
  };

  const fetchNotifications = async () => {
    const { data } = await getNotifications();
    data && setNotificationData(data.data);
  };

  // Unlock AudioContext explicitly
  const unlockAudioContext = () => {
    if (Howler.ctx && Howler.ctx.state === "suspended") {
      Howler.ctx.resume().then(() => {
        console.log("AudioContext resumed");
        setAudioUnlocked(true); // Mark as unlocked
      });
    } else if (Howler.ctx && Howler.ctx.state === "running") {
      setAudioUnlocked(true); // Already running
    }
  };

  useEffect(() => {
    fetchCount();
    fetchNotifications();

    if (echo && user?.id) {
      const channel = echo.private(`notifications.${user?.id}`);
      channel.listen("NotificationCountUpdated", (event) => {
        console.log("Real-time event received: ", event);
        setCount(event.count);
        setNotificationData(event.notificationData);
        if (audioUnlocked) {
          sound.play(); // Play only if audio context is unlocked
        } else {
          console.log(
            "AudioContext not yet unlocked. Interact with the page to enable sound."
          );
        }
      });

      return () => {
        channel.stopListening("NotificationCountUpdated");
      };
    }
  }, [echo, user?.id, audioUnlocked]); // Add audioUnlocked as a dependency

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    unlockAudioContext(); // Unlock on first click
  };
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Header title="Notification" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              {!audioUnlocked && (
                <p className="text-red-500">
                  Click the mail icon to enable notification sounds.
                </p>
              )}
              <div className="flex flex-row justify-end">
                <Badge badgeContent={count || 0} color="success">
                  <MailIcon color="action" onClick={handleClick} />
                </Badge>
                <StyledMenu
                  id="demo-customized-menu"
                  MenuListProps={{
                    "aria-labelledby": "demo-customized-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  {notificationData.map((item) => (
                    <MenuItem onClick={handleClose} key={item.id}>
                      {item.message}
                    </MenuItem>
                  ))}
                </StyledMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
