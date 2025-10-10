using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGameCharacteristics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GameCharacteristics",
                columns: table => new
                {
                    GameId = table.Column<Guid>(type: "uuid", nullable: false),
                    Platform = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    MinVersion = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    MinCpu = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    MinRam = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    MinGpu = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    MinDirectX = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    MinMemory = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    MinAudioCard = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    RecommendedVersion = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    RecommendedCpu = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    RecommendedRam = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    RecommendedGpu = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    RecommendedDirectX = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    RecommendedMemory = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    RecommendedAudioCard = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Controller = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Additional = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    LangAudio = table.Column<List<string>>(type: "text[]", nullable: false),
                    LangText = table.Column<List<string>>(type: "text[]", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameCharacteristics", x => x.GameId);
                    table.ForeignKey(
                        name: "FK_GameCharacteristics_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GameCharacteristics");
        }
    }
}
