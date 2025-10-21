using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFriendshipEntitiesWithNavigationProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Games_GameId1",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_GameId1",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "GameId1",
                table: "Reviews");

            migrationBuilder.CreateIndex(
                name: "IX_FriendRequests_Status",
                table: "FriendRequests",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_FriendRequests_Status",
                table: "FriendRequests");

            migrationBuilder.AddColumn<Guid>(
                name: "GameId1",
                table: "Reviews",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_GameId1",
                table: "Reviews",
                column: "GameId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Games_GameId1",
                table: "Reviews",
                column: "GameId1",
                principalTable: "Games",
                principalColumn: "Id");
        }
    }
}
