using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMultiPlatformSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_GameCharacteristics",
                table: "GameCharacteristics");

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "GameCharacteristics",
                type: "uuid",
                nullable: true);

            migrationBuilder.Sql("UPDATE \"GameCharacteristics\" SET \"Id\" = gen_random_uuid();");

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "GameCharacteristics",
                type: "uuid",
                nullable: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "GameCharacteristics",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "GameCharacteristics",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddPrimaryKey(
                name: "PK_GameCharacteristics",
                table: "GameCharacteristics",
                column: "Id");
            
            migrationBuilder.CreateIndex(
                name: "IX_GameCharacteristics_GameId_Platform",
                table: "GameCharacteristics",
                columns: new[] { "GameId", "Platform" },
                unique: true);

            migrationBuilder.CreateTable(
                name: "GameConsoleFeatures",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    GameId = table.Column<Guid>(type: "uuid", nullable: false),
                    Platform = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    PerformanceModes = table.Column<string>(type: "text", nullable: true),
                    Resolution = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    FrameRate = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    HDRSupport = table.Column<bool>(type: "boolean", nullable: false),
                    RayTracingSupport = table.Column<bool>(type: "boolean", nullable: false),
                    ControllerFeatures = table.Column<string>(type: "text", nullable: true),
                    StorageRequired = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    OnlinePlayRequired = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameConsoleFeatures", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GameConsoleFeatures_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GameCharacteristics_GameId",
                table: "GameCharacteristics",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_GameConsoleFeatures_GameId",
                table: "GameConsoleFeatures",
                column: "GameId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GameConsoleFeatures");

            migrationBuilder.DropIndex(
                name: "IX_GameCharacteristics_GameId_Platform",
                table: "GameCharacteristics");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GameCharacteristics",
                table: "GameCharacteristics");

            migrationBuilder.DropIndex(
                name: "IX_GameCharacteristics_GameId",
                table: "GameCharacteristics");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "GameCharacteristics");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "GameCharacteristics");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "GameCharacteristics");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GameCharacteristics",
                table: "GameCharacteristics",
                column: "GameId");
        }
    }
}
