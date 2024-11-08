import React from "react";
import FormInput from "./../../components/reusable/InputField";
import useAuth from "./../../hooks/useAuth";
import { LoadingOverlay } from "../../components/reusable/Loading";
import ContainerComponent from "./ContainerComponent";
import ProfilePicture from "./PictureUpload";
import { useParams } from "react-router-dom";
import Navbar from "./../../components/reusable/Navbar";
import FloatingContact from "./FloatingContact";
import Footer from "./Footer";

const PublicProfile = ({ userInfo }) => {
  const { userId } = useParams();
  const { loading } = useAuth();

  if (loading) {
    return <LoadingOverlay message="We are fetching the public profile..." />;
  }

  const formattedDate = new Date(userInfo.createdAt).toLocaleDateString(
    "en-CA"
  );

  return (
    <>
      <Navbar />
      <ContainerComponent>
        <section className="w-full rounded-3xl pb-[64px] ">
          <div className="lg:w-full lg:px-[32px] lg:mx-auto h-full pb-6 pt-12 sm:px-6 lg:pb-0">
            <div className="flex items-center justify-center mb-6">
              <ProfilePicture big={true} userId={userId} />
            </div>

            <p className="text-center mb-6">{userInfo.lastName}</p>

            <FormInput
              label="Bio"
              value={
                userInfo?.bio
                  ? userInfo.bio
                  : "This user does not seem to have set any bio..."
              }
              placeholder="Tell everyone about yourself..."
              className="p-3 sm:p-4 h-fit"
              rounded
              disabled
            />

            <div className="space-y-4">
              {userInfo.entity && (
                <FormInput
                  label="Entity"
                  value={userInfo.entity}
                  disabled
                  rounded
                  className="p-3 sm:p-4"
                />
              )}

              <FormInput
                label="First Name"
                value={userInfo.firstName}
                placeholder="First Name"
                className="p-3 sm:p-4"
                disabled
                rounded
              />
              <FormInput
                label="Last Name"
                value={userInfo.lastName}
                placeholder="Last Name"
                className="p-3 sm:p-4"
                disabled
                rounded
              />

              <FormInput
                label="Email"
                value={userInfo.email}
                type="email"
                rounded
                disabled
                className="p-3 sm:p-4"
              />
              <FormInput
                label="Phone Number"
                value={userInfo.phoneNumber}
                type="tel"
                rounded
                disabled
                className="p-3 sm:p-4"
              />

              <FormInput
                label="Location"
                placeholder="Enter Location"
                value={userInfo.location}
                disabled
                rounded
                className="p-3 sm:p-4"
              />

              <FormInput
                label="Account Creation Date"
                value={formattedDate}
                disabled
                rounded
                className="p-3 sm:p-4"
              />

              <FormInput
                label="Account Status"
                value={userInfo.isActive ? "Active" : "Not Active"}
                disabled
                rounded
                className="p-3 sm:p-4"
              />
            </div>
          </div>
        </section>
      </ContainerComponent>
      <FloatingContact />
      <Footer />
    </>
  );
};

export default PublicProfile;
