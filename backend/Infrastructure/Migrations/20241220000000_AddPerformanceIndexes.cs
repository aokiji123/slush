using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPerformanceIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add composite index for game filtering by IsDlc and BaseGameId
            migrationBuilder.CreateIndex(
                name: "IX_Games_IsDlc_BaseGameId",
                table: "Games",
                columns: new[] { "IsDlc", "BaseGameId" });

            // Add composite index for game filtering by Rating and Price
            migrationBuilder.CreateIndex(
                name: "IX_Games_Rating_Price",
                table: "Games",
                columns: new[] { "Rating", "Price" });

            // Add index for game filtering by SalePrice
            migrationBuilder.CreateIndex(
                name: "IX_Games_SalePrice",
                table: "Games",
                columns: new[] { "SalePrice" });

            // Add index for game filtering by ReleaseDate
            migrationBuilder.CreateIndex(
                name: "IX_Games_ReleaseDate",
                table: "Games",
                columns: new[] { "ReleaseDate" });

            // Add index for user search by Nickname
            migrationBuilder.CreateIndex(
                name: "IX_Users_Nickname",
                table: "Users",
                columns: new[] { "Nickname" });

            // Add index for user search by UserName
            migrationBuilder.CreateIndex(
                name: "IX_Users_UserName",
                table: "Users",
                columns: new[] { "UserName" });

            // Add composite index for user online status
            migrationBuilder.CreateIndex(
                name: "IX_Users_IsOnline_LastSeenAt",
                table: "Users",
                columns: new[] { "IsOnline", "LastSeenAt" });

            // Add index for reviews by GameId and UserId
            migrationBuilder.CreateIndex(
                name: "IX_Reviews_GameId_UserId",
                table: "Reviews",
                columns: new[] { "GameId", "UserId" });

            // Add index for reviews by Rating
            migrationBuilder.CreateIndex(
                name: "IX_Reviews_Rating",
                table: "Reviews",
                columns: new[] { "Rating" });

            // Add index for reviews by CreatedAt
            migrationBuilder.CreateIndex(
                name: "IX_Reviews_CreatedAt",
                table: "Reviews",
                columns: new[] { "CreatedAt" });

            // Add index for wishlist by UserId
            migrationBuilder.CreateIndex(
                name: "IX_Wishlists_UserId",
                table: "Wishlists",
                columns: new[] { "UserId" });

            // Add index for library by UserId
            migrationBuilder.CreateIndex(
                name: "IX_Libraries_UserId",
                table: "Libraries",
                columns: new[] { "UserId" });

            // Add index for library by GameId
            migrationBuilder.CreateIndex(
                name: "IX_Libraries_GameId",
                table: "Libraries",
                columns: new[] { "GameId" });

            // Add index for payments by UserId
            migrationBuilder.CreateIndex(
                name: "IX_Payments_UserId",
                table: "Payments",
                columns: new[] { "UserId" });

            // Add index for payments by Data (date)
            migrationBuilder.CreateIndex(
                name: "IX_Payments_Data",
                table: "Payments",
                columns: new[] { "Data" });

            // Add index for friendships by User1Id
            migrationBuilder.CreateIndex(
                name: "IX_Friendships_User1Id",
                table: "Friendships",
                columns: new[] { "User1Id" });

            // Add index for friendships by User2Id
            migrationBuilder.CreateIndex(
                name: "IX_Friendships_User2Id",
                table: "Friendships",
                columns: new[] { "User2Id" });

            // Add index for friend requests by SenderId
            migrationBuilder.CreateIndex(
                name: "IX_FriendRequests_SenderId",
                table: "FriendRequests",
                columns: new[] { "SenderId" });

            // Add index for friend requests by ReceiverId
            migrationBuilder.CreateIndex(
                name: "IX_FriendRequests_ReceiverId",
                table: "FriendRequests",
                columns: new[] { "ReceiverId" });

            // Add index for friend requests by Status
            migrationBuilder.CreateIndex(
                name: "IX_FriendRequests_Status",
                table: "FriendRequests",
                columns: new[] { "Status" });

            // Add index for posts by AuthorId
            migrationBuilder.CreateIndex(
                name: "IX_Posts_AuthorId",
                table: "Posts",
                columns: new[] { "AuthorId" });

            // Add index for posts by GameId
            migrationBuilder.CreateIndex(
                name: "IX_Posts_GameId",
                table: "Posts",
                columns: new[] { "GameId" });

            // Add index for posts by CreatedAt
            migrationBuilder.CreateIndex(
                name: "IX_Posts_CreatedAt",
                table: "Posts",
                columns: new[] { "CreatedAt" });

            // Add index for comments by AuthorId
            migrationBuilder.CreateIndex(
                name: "IX_Comments_AuthorId",
                table: "Comments",
                columns: new[] { "AuthorId" });

            // Add index for comments by PostId
            migrationBuilder.CreateIndex(
                name: "IX_Comments_PostId",
                table: "Comments",
                columns: new[] { "PostId" });

            // Add index for comments by ParentCommentId
            migrationBuilder.CreateIndex(
                name: "IX_Comments_ParentCommentId",
                table: "Comments",
                columns: new[] { "ParentCommentId" });

            // Add index for profile comments by ProfileUserId
            migrationBuilder.CreateIndex(
                name: "IX_ProfileComments_ProfileUserId",
                table: "ProfileComments",
                columns: new[] { "ProfileUserId" });

            // Add index for profile comments by AuthorId
            migrationBuilder.CreateIndex(
                name: "IX_ProfileComments_AuthorId",
                table: "ProfileComments",
                columns: new[] { "AuthorId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop all indexes in reverse order
            migrationBuilder.DropIndex(
                name: "IX_ProfileComments_AuthorId",
                table: "ProfileComments");

            migrationBuilder.DropIndex(
                name: "IX_ProfileComments_ProfileUserId",
                table: "ProfileComments");

            migrationBuilder.DropIndex(
                name: "IX_Comments_ParentCommentId",
                table: "Comments");

            migrationBuilder.DropIndex(
                name: "IX_Comments_PostId",
                table: "Comments");

            migrationBuilder.DropIndex(
                name: "IX_Comments_AuthorId",
                table: "Comments");

            migrationBuilder.DropIndex(
                name: "IX_Posts_CreatedAt",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_Posts_GameId",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_Posts_AuthorId",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_FriendRequests_Status",
                table: "FriendRequests");

            migrationBuilder.DropIndex(
                name: "IX_FriendRequests_ReceiverId",
                table: "FriendRequests");

            migrationBuilder.DropIndex(
                name: "IX_FriendRequests_SenderId",
                table: "FriendRequests");

            migrationBuilder.DropIndex(
                name: "IX_Friendships_User2Id",
                table: "Friendships");

            migrationBuilder.DropIndex(
                name: "IX_Friendships_User1Id",
                table: "Friendships");

            migrationBuilder.DropIndex(
                name: "IX_Payments_Data",
                table: "Payments");

            migrationBuilder.DropIndex(
                name: "IX_Payments_UserId",
                table: "Payments");

            migrationBuilder.DropIndex(
                name: "IX_Libraries_GameId",
                table: "Libraries");

            migrationBuilder.DropIndex(
                name: "IX_Libraries_UserId",
                table: "Libraries");

            migrationBuilder.DropIndex(
                name: "IX_Wishlists_UserId",
                table: "Wishlists");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_CreatedAt",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_Rating",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_GameId_UserId",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Users_IsOnline_LastSeenAt",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_UserName",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_Nickname",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Games_ReleaseDate",
                table: "Games");

            migrationBuilder.DropIndex(
                name: "IX_Games_SalePrice",
                table: "Games");

            migrationBuilder.DropIndex(
                name: "IX_Games_Rating_Price",
                table: "Games");

            migrationBuilder.DropIndex(
                name: "IX_Games_IsDlc_BaseGameId",
                table: "Games");
        }
    }
}
