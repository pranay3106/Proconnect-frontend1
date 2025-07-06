import React, { useEffect } from "react";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { AcceptConnection, getMyConnectonRequests } from "@/config/redux/action/authAction";
import styles from "./style.module.css";
import { Base_Url } from "@/config";
import { useRouter } from "next/router";

export default function MyConnectionsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyConnectonRequests({ token: localStorage.getItem("token") }));
  }, [dispatch]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.7rem" }}>
          <h4>My Connections</h4>

          {Array.isArray(authState.connectionRequests) && authState.connectionRequests.length === 0 && (
            <h1>No Connection Request pending</h1>
          )}

          {Array.isArray(authState.connectionRequests) &&
            authState.connectionRequests.length !== 0 &&
            authState.connectionRequests
              .filter((connection) => connection.status_accepted === null)
              .map((user) => (
                <div
                  key={user._id}
                  className={styles.userCard}
                  onClick={() => router.push(`/view_profile/${user.userId.username}`)}
                >
                  <div
                    className={styles.profilePicture}
                    style={{ display: "flex", alignItems: "center", gap: "1.2rem", justifyContent: "space-between" }}
                  >
                    <img src={`${Base_Url}/uploads/${user.userId.profilePicture}`} alt="profile" />
                  </div>

                  <div className={styles.userInfo}>
                    <h1>{user.userId.name}</h1>
                    <p>{user.userId.username}</p>
                  </div>

                  <button
                    className={styles.connectedButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(
                        AcceptConnection({
                          requestId: user._id, // changed from receiverId to requestId as expected by backend
                          token: localStorage.getItem("token"),
                          action: "accept",
                        })
                      );
                    }}
                  >
                    Accept
                  </button>
                </div>
              ))}

          <h4>My Network</h4>

          {Array.isArray(authState.connectionRequests) &&
            authState.connectionRequests.length !== 0 &&
            authState.connectionRequests
              .filter((connection) => connection.status_accepted !== null)
              .map((user) => (
                <div
                  key={user._id}
                  className={styles.userCard}
                  onClick={() => router.push(`/view_profile/${user.userId.username}`)}
                >
                  <div
                    className={styles.profilePicture}
                    style={{ display: "flex", alignItems: "center", gap: "1.2rem", justifyContent: "space-between" }}
                  >
                    <img src={`${Base_Url}/uploads/${user.userId.profilePicture}`} alt="profile" />
                  </div>

                  <div className={styles.userInfo}>
                    <h1>{user.userId.name}</h1>
                    <p>{user.userId.username}</p>
                  </div>
                </div>
              ))}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
