import { Prisma } from '@prisma/client';

import { prisma } from '../../src/prisma';
import { makeBooleanIterator } from './lib/util';

const setupRoles = async (
  {
    ownerId,
    adminId,
    bannedAdminId,
    userIds,
  }: {
    ownerId: number;
    adminId: number;
    bannedAdminId: number;
    userIds: number[];
  },
  chapterIds: number[],
  chapterRoles: Record<string, { name: string; id: number }>, // TODO: import type from chapterRoles.factory
): Promise<void> => {
  const usersData: Prisma.chapter_usersCreateManyInput[] = [];
  const subscribeIterator = makeBooleanIterator();

  // We create one admin for chapter 1, but none for the other chapters. That
  // means we can test requests from that admin to the other chapters and
  // confirm that the requests are rejected.
  const adminData: Prisma.chapter_usersCreateManyInput = {
    joined_date: new Date(),
    chapter_id: 1,
    user_id: adminId,
    chapter_role_id: chapterRoles.administrator.id,
    subscribed: true,
  };

  usersData.push(adminData);

  for (const chapterId of chapterIds) {
    const ownerData: Prisma.chapter_usersCreateManyInput = {
      joined_date: new Date(),
      chapter_id: chapterId,
      user_id: ownerId,
      chapter_role_id: chapterRoles.member.id, // This user is an instance owner
      // so this chapter role should not provide additional permissions beyond
      // those provided by the instance owner role. It is possible for them to
      // be a member of a chapater, though, so this grants them the member role
      // for all chapters.
      subscribed: true,
    };

    usersData.push(ownerData);

    const bannedAdminData: Prisma.chapter_usersCreateManyInput = {
      joined_date: new Date(),
      chapter_id: chapterId,
      user_id: bannedAdminId,
      chapter_role_id: chapterRoles.administrator.id,
      subscribed: false,
    };

    usersData.push(bannedAdminData);

    const [firstUserId] = userIds;
    const memberBanData: Prisma.user_bansCreateManyInput = {
      user_id: firstUserId,
      chapter_id: chapterId,
    };
    const adminBanData: Prisma.user_bansCreateManyInput = {
      user_id: bannedAdminId,
      chapter_id: chapterId,
    };
    await prisma.user_bans.createMany({
      data: [memberBanData, adminBanData],
    });
    // makes sure half of each chapter's users are interested, but
    // alternates which half.
    const userSubscribed = makeBooleanIterator(subscribeIterator.next().value);
    for (const user of userIds) {
      const userData: Prisma.chapter_usersCreateManyInput = {
        joined_date: new Date(),
        chapter_id: chapterId,
        user_id: user,
        chapter_role_id: chapterRoles.member.id,
        subscribed: userSubscribed.next().value,
      };

      usersData.push(userData);
    }
  }
  await prisma.chapter_users.createMany({ data: usersData });
};

export default setupRoles;
