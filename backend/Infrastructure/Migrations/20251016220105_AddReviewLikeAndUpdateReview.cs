using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddReviewLikeAndUpdateReview : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Check if columns exist before dropping them
            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Reviews' AND column_name = 'Dislikes') THEN
                        ALTER TABLE ""Reviews"" DROP COLUMN ""Dislikes"";
                    END IF;
                END $$;
            ");

            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Reviews' AND column_name = 'Username') THEN
                        ALTER TABLE ""Reviews"" DROP COLUMN ""Username"";
                    END IF;
                END $$;
            ");

            // Add GameId1 column if it doesn't exist
            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Reviews' AND column_name = 'GameId1') THEN
                        ALTER TABLE ""Reviews"" ADD ""GameId1"" uuid;
                    END IF;
                END $$;
            ");

            // Add UserId column if it doesn't exist
            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Reviews' AND column_name = 'UserId') THEN
                        ALTER TABLE ""Reviews"" ADD ""UserId"" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
                    END IF;
                END $$;
            ");

            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Posts') THEN
                        CREATE TABLE ""Posts"" (
                            ""Id"" uuid NOT NULL,
                            ""Title"" character varying(200) NOT NULL,
                            ""Content"" text NOT NULL,
                            ""Type"" integer NOT NULL,
                            ""CreatedAt"" timestamp with time zone NOT NULL,
                            ""UpdatedAt"" timestamp with time zone NOT NULL,
                            ""AuthorId"" uuid NOT NULL,
                            ""GameId"" uuid NOT NULL,
                            CONSTRAINT ""PK_Posts"" PRIMARY KEY (""Id"")
                        );
                    END IF;
                END $$;
            ");

            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ReviewLikes') THEN
                        CREATE TABLE ""ReviewLikes"" (
                            ""ReviewId"" uuid NOT NULL,
                            ""UserId"" uuid NOT NULL,
                            ""Id"" uuid NOT NULL,
                            ""CreatedAt"" timestamp with time zone NOT NULL,
                            CONSTRAINT ""PK_ReviewLikes"" PRIMARY KEY (""UserId"", ""ReviewId""),
                            CONSTRAINT ""FK_ReviewLikes_Reviews_ReviewId"" FOREIGN KEY (""ReviewId"") REFERENCES ""Reviews"" (""Id"") ON DELETE CASCADE,
                            CONSTRAINT ""FK_ReviewLikes_Users_UserId"" FOREIGN KEY (""UserId"") REFERENCES ""Users"" (""Id"") ON DELETE CASCADE
                        );
                    END IF;
                END $$;
            ");

            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Comments') THEN
                        CREATE TABLE ""Comments"" (
                            ""Id"" uuid NOT NULL,
                            ""Content"" text NOT NULL,
                            ""CreatedAt"" timestamp with time zone NOT NULL,
                            ""AuthorId"" uuid NOT NULL,
                            ""PostId"" uuid NOT NULL,
                            ""ParentCommentId"" uuid,
                            CONSTRAINT ""PK_Comments"" PRIMARY KEY (""Id""),
                            CONSTRAINT ""FK_Comments_Comments_ParentCommentId"" FOREIGN KEY (""ParentCommentId"") REFERENCES ""Comments"" (""Id"") ON DELETE CASCADE,
                            CONSTRAINT ""FK_Comments_Posts_PostId"" FOREIGN KEY (""PostId"") REFERENCES ""Posts"" (""Id"") ON DELETE CASCADE
                        );
                    END IF;
                END $$;
            ");

            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Media') THEN
                        CREATE TABLE ""Media"" (
                            ""Id"" uuid NOT NULL,
                            ""File"" text NOT NULL,
                            ""IsCover"" boolean NOT NULL,
                            ""Type"" integer NOT NULL,
                            ""PostId"" uuid NOT NULL,
                            CONSTRAINT ""PK_Media"" PRIMARY KEY (""Id""),
                            CONSTRAINT ""FK_Media_Posts_PostId"" FOREIGN KEY (""PostId"") REFERENCES ""Posts"" (""Id"") ON DELETE CASCADE
                        );
                    END IF;
                END $$;
            ");

            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'PostLikes') THEN
                        CREATE TABLE ""PostLikes"" (
                            ""UserId"" uuid NOT NULL,
                            ""PostId"" uuid NOT NULL,
                            CONSTRAINT ""PK_PostLikes"" PRIMARY KEY (""UserId"", ""PostId""),
                            CONSTRAINT ""FK_PostLikes_Posts_PostId"" FOREIGN KEY (""PostId"") REFERENCES ""Posts"" (""Id"") ON DELETE CASCADE
                        );
                    END IF;
                END $$;
            ");

            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'CommentLikes') THEN
                        CREATE TABLE ""CommentLikes"" (
                            ""UserId"" uuid NOT NULL,
                            ""CommentId"" uuid NOT NULL,
                            CONSTRAINT ""PK_CommentLikes"" PRIMARY KEY (""UserId"", ""CommentId""),
                            CONSTRAINT ""FK_CommentLikes_Comments_CommentId"" FOREIGN KEY (""CommentId"") REFERENCES ""Comments"" (""Id"") ON DELETE CASCADE
                        );
                    END IF;
                END $$;
            ");

            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'IX_Reviews_GameId1') THEN
                        CREATE INDEX ""IX_Reviews_GameId1"" ON ""Reviews"" (""GameId1"");
                    END IF;
                END $$;
            ");

            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'IX_Reviews_UserId') THEN
                        CREATE INDEX ""IX_Reviews_UserId"" ON ""Reviews"" (""UserId"");
                    END IF;
                END $$;
            ");

            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'IX_CommentLikes_CommentId') THEN
                        CREATE INDEX ""IX_CommentLikes_CommentId"" ON ""CommentLikes"" (""CommentId"");
                    END IF;
                END $$;
            ");

            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'IX_Comments_ParentCommentId') THEN
                        CREATE INDEX ""IX_Comments_ParentCommentId"" ON ""Comments"" (""ParentCommentId"");
                    END IF;
                END $$;
            ");

            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'IX_Comments_PostId') THEN
                        CREATE INDEX ""IX_Comments_PostId"" ON ""Comments"" (""PostId"");
                    END IF;
                END $$;
            ");

            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'IX_Media_PostId') THEN
                        CREATE INDEX ""IX_Media_PostId"" ON ""Media"" (""PostId"");
                    END IF;
                END $$;
            ");

            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'IX_PostLikes_PostId') THEN
                        CREATE INDEX ""IX_PostLikes_PostId"" ON ""PostLikes"" (""PostId"");
                    END IF;
                END $$;
            ");

            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'IX_Posts_GameId') THEN
                        CREATE INDEX ""IX_Posts_GameId"" ON ""Posts"" (""GameId"");
                    END IF;
                END $$;
            ");

            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'IX_ReviewLikes_ReviewId') THEN
                        CREATE INDEX ""IX_ReviewLikes_ReviewId"" ON ""ReviewLikes"" (""ReviewId"");
                    END IF;
                END $$;
            ");

            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'FK_Reviews_Games_GameId1') THEN
                        ALTER TABLE ""Reviews"" ADD CONSTRAINT ""FK_Reviews_Games_GameId1"" FOREIGN KEY (""GameId1"") REFERENCES ""Games"" (""Id"");
                    END IF;
                END $$;
            ");

            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'FK_Reviews_Users_UserId') THEN
                        ALTER TABLE ""Reviews"" ADD CONSTRAINT ""FK_Reviews_Users_UserId"" FOREIGN KEY (""UserId"") REFERENCES ""Users"" (""Id"") ON DELETE CASCADE;
                    END IF;
                END $$;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Games_GameId1",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Users_UserId",
                table: "Reviews");

            migrationBuilder.DropTable(
                name: "CommentLikes");

            migrationBuilder.DropTable(
                name: "Media");

            migrationBuilder.DropTable(
                name: "PostLikes");

            migrationBuilder.DropTable(
                name: "ReviewLikes");

            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_GameId1",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_UserId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "GameId1",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Reviews");

            migrationBuilder.AddColumn<int>(
                name: "Dislikes",
                table: "Reviews",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "Reviews",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }
    }
}
