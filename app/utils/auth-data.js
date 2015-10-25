export const parse_auth_data = {
    github(auth_data){
        return {
            username: auth_data.github.username,
            profile_image: auth_data.github.profileImageURL,
            color: auth_data.github.username == "OliverDashiell" ? "#F9D068" : "#ffff"
        }
    },
    google(auth_data){
        return {
            username: auth_data.google.displayName,
            profile_image: auth_data.google.profileImageURL,
            color: "#ffff"
        }
    },
    twitter(auth_data){
        return {
            username: auth_data.twitter.username,
            profile_image: auth_data.twitter.profileImageURL,
            color: "#ffff"
        }
    }
}
