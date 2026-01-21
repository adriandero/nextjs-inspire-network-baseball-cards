import { client } from "@/src/lib/sanity/client";
import {
  Profile,
  ProfileWithBasicTeams,
  ProfileWithDetailedTeams,
  ProfileWithFullTeams,
  ProfilesFromUserTeams,
  ProfilesByTeam,
  GroupedProfilesResponse,
  TeamWithProfiles,
} from "@/src/shared/entities/profile";

export async function getProfileByUuid(
  uuid: string,
): Promise<ProfileWithFullTeams | undefined> {
  if (!uuid) return undefined;

  const query = `*[_type == "profile" && uuid == $uuid && !(_id in path('drafts.**'))][0]{
    _id,
    _type,
    _rev,
    _createdAt,
    _updatedAt,
    name,
    uuid,
    "slug": slug.current,
    jobRole,
    values,

    avatar {
      asset->{
        _id,
        url
      }
    },
    workingGenius {
      title,
      widget {
        wonder,
        invention,
        discernment,
        galvanizing,
        enablement,
        tenacity
      }
    },
    principleYouArchetype,
    principleYouArchetypeLeast,
    kolbeStrengths {
      factFinder,
      followThru,
      quickStart,
      implementer
    },
    kolbeStrengths2 {
      factFinder,
      followThru,
      quickStart,
      implementer
    },
    valuesAssessmentPdf {
      asset->{
        _id,
        url,
        originalFilename,
        size,
        extension
      }
    },
    workingGeniusAssessmentPdf {
      asset->{
        _id,
        url,
        originalFilename,
        size,
        extension
      }
    },
    principlesYouAssessmentPdf {
      asset->{
        _id,
        url,
        originalFilename,
        size,
        extension
      }
    },
    kolbeAssessmentPdf {
      asset->{
        _id,
        url,
        originalFilename,
        size,
        extension
      }
    },
    "team": team[]->{
      name,
      "slug": slug.current,
      isameriprise,
      "company": company->{
        _id,
        _type,
        name,
        "slug": slug.current,
        companyLogo {
          asset->{
            _id,
            url
          }
        }
      },
      teamLogo {
        asset->{
          url, 
          metadata {
            dimensions {
              width,
              height
            }
          }
        }
      }
    }
  }`;

  const options = { next: { revalidate: 30 } };

  try {
    const profile = await client.fetch<ProfileWithFullTeams>(
      query,
      { uuid },
      options,
    );
    return profile || null;
  } catch (error) {
    console.error("Failed to fetch profile by UUID:", error);
    throw new Error(`Unable to fetch profile with UUID: ${uuid}`);
  }
}

export async function getProfilesByUuids(
  uuids: string[],
): Promise<ProfileWithFullTeams[]> {
  if (!uuids.length) return [];

  const query = `*[ _type == "profile" && uuid in $uuids && !(_id in path('drafts.**'))]{
    ...,
    _id,
    _type,
    name,
    uuid,
    "slug": slug.current,
    jobRole,
    avatar {
      asset->{
        _id,
        url
      }
    },
    "team": team[]->{
      name,
      "slug": slug.current,
      isameriprise,
      "company": company->{
        _id,
        _type,
        name,
        "slug": slug.current,
        companyLogo {
          asset->{
            _id,
            url
          }
        }
      },
      teamLogo {
        asset->{
          url, 
          metadata {
            dimensions {
              width,
              height
            }
          }
        }
      }
    }
  }`;

  const options = { next: { revalidate: 30 } };

  try {
    const profiles = await client.fetch<ProfileWithFullTeams[]>(
      query,
      { uuids },
      options,
    );
    return profiles || [];
  } catch (error) {
    console.error("Failed to fetch profiles by UUIDs:", error);
    throw new Error("Unable to fetch profiles");
  }
}

export async function getProfileIdByEmail(
  email: string,
): Promise<string | null> {
  if (!email) return null;

  const query = `*[_type == "profile" && lower(email) == lower($email) && !(_id in path('drafts.**'))][0]._id`;

  try {
    const profileId = await client.fetch<string | null>(query, {
      email, // no need to lowercase here, GROQ handles it
    });

    return profileId || null;
  } catch (error) {
    console.error("Failed to fetch profile by email:", error);
    throw new Error(`Unable to fetch profile with email: ${email}`);
  }
}

export async function getProfilesByTeamId(
  teamId: string,
): Promise<ProfileWithBasicTeams[]> {
  if (!teamId) return [];

  const query = `
    *[_type == "profile" && !(_id in path('drafts.**')) && $teamId in team[]->_id] {
      _id,
      _type,
      name,
      uuid,
      "slug": slug.current,
      jobRole,

      avatar {
        asset->{
          _id,
          url
        }
      },
      "teams": team[]-> | order(name asc) {
        _id,
        name,
        "slug": slug.current
      }
    }
  `;

  const options = { next: { revalidate: 30 } };

  try {
    const profiles = await client.fetch<ProfileWithBasicTeams[]>(
      query,
      { teamId },
      options,
    );
    return profiles || [];
  } catch (error) {
    console.error("Failed to fetch profiles by team ID:", error);
    throw new Error(`Unable to fetch profiles for team: ${teamId}`);
  }
}

export async function getAllProfilesGroupedByTeam(): Promise<ProfilesByTeam> {
  const query = `
    {
      "teams": *[_type == "team" && !(_id in path('drafts.**'))] {
        "slug": slug.current,
        name,
        "company": company->{
          name,
          "slug": slug.current
        },
        "profiles": *[_type == "profile" && !(_id in path('drafts.**')) && references(^._id)] {
          _id,
          _type,
          name,
          uuid,
          "slug": slug.current,
          jobRole,
          avatar {
            asset->{
              _id,
              url
            }
          },
        }
      }
    }
  `;

  const options = { next: { revalidate: 30 } };

  try {
    const result = await client.fetch<GroupedProfilesResponse>(
      query,
      {},
      options,
    );

    if (!result?.teams) {
      return { teams: {} };
    }

    const profilesByTeam = result.teams.reduce(
      (acc: { [key: string]: Profile[] }, team: TeamWithProfiles) => {
        acc[team.slug] = team.profiles;
        return acc;
      },
      {},
    );

    return { teams: profilesByTeam };
  } catch (error) {
    console.error("Failed to fetch grouped profiles:", error);
    throw new Error("Unable to fetch grouped profiles");
  }
}

export async function getTeammateProfiles(
  excludeUuid: string,
  allowedSlugs: string[],
  isAdmin: boolean = false,
): Promise<ProfileWithBasicTeams[]> {
  if (!excludeUuid) return [];

  // For non-admins, we still need allowedSlugs
  if (!isAdmin && (!allowedSlugs || allowedSlugs.length === 0)) return [];

  const query = `
    *[_type == "profile" && uuid == $excludeUuid && !(_id in path('drafts.**'))][0] {
      "teamSlugs": team[]->slug.current
    } {
      "profiles": *[
        _type == "profile"
        && !(_id in path('drafts.**'))
        && uuid != $excludeUuid
        && count((team[]->slug.current)[@ in ^.^.teamSlugs]) > 0
        ${!isAdmin ? "&& count((team[]->slug.current)[@ in $allowedSlugs]) > 0" : ""}
      ] {
        _id,
        _type,
        name,
        uuid,
        "slug": slug.current,
        jobRole,
   
        avatar {
          asset->{
            _id,
            url
          }
        },
        "teams": team[]-> | order(name asc) {
          _id,
          name,
          "slug": slug.current
        }
      }
    }.profiles
  `;

  const params = isAdmin ? { excludeUuid } : { excludeUuid, allowedSlugs };
  const options = { next: { revalidate: 30 } };

  try {
    const profiles = await client.fetch<ProfileWithBasicTeams[]>(
      query,
      params,
      options,
    );
    return profiles || [];
  } catch (error) {
    console.error("Failed to fetch teammate profiles:", error);
    throw new Error(`Unable to fetch teammates for profile: ${excludeUuid}`);
  }
}

export async function getProfilesFromUserTeams(
  userEmail: string,
  userTeamSlugs: string[],
): Promise<ProfilesFromUserTeams | null> {
  if (!userEmail || !userTeamSlugs.length) return null;

  const query = `
    *[_type == "user" && email == $userEmail && !(_id in path('drafts.**'))][0] {
      "teamProfiles": *[_type == "profile" && !(_id in path('drafts.**')) && count((team[]->slug.current)[@ in $userTeamSlugs]) > 0] {
        _id,
        _type,
        name,
        uuid,
        "slug": slug.current,
        jobRole,
        avatar {
          asset->{
            _id,
            url
          }
        },
        "teams": team[]-> | order(name asc) {
          _id,
          _type,
          name,
          "slug": slug.current,
          "company": company->{
            name,
            "slug": slug.current
          },
          isameriprise,
          groups
        }
      }
    }
  `;

  const options = { next: { revalidate: 30 } };

  try {
    const profiles = await client.fetch<ProfilesFromUserTeams>(
      query,
      { userEmail, userTeamSlugs },
      options,
    );
    return profiles || null;
  } catch (error) {
    console.error("Failed to fetch profiles from user teams:", error);
    throw new Error(`Unable to fetch profiles for user: ${userEmail}`);
  }
}

export async function getAllProfiles(): Promise<ProfileWithDetailedTeams[]> {
  const query = `*[ _type == "profile" && !(_id in path('drafts.**'))] {
    _id,
    _type,   
    _rev,               
    _createdAt,         
    _updatedAt,         
    name,
    uuid,
    "slug": slug.current,
    jobRole,
    avatar {
      asset->{
        _id,
        url
      }
    },
    "teams": team[]-> | order(name asc) {
      _id,
      _type,
      name,
      "slug": slug.current,
      "company": company->{
        name,
        "slug": slug.current
      },
      isameriprise,
      groups
    }
  }`;

  const options = { next: { revalidate: 30 } };

  try {
    const profiles = await client.fetch<ProfileWithDetailedTeams[]>(
      query,
      {},
      options,
    );
    return profiles || [];
  } catch (error) {
    console.error("Failed to fetch all profiles:", error);
    throw new Error("Unable to fetch profiles");
  }
}
//
// export async function getProfilesAssessmentPdf(
//   uuid: string,
//   assessmentType: AssessmentType,
// ): Promise<AssessmentPdfFile | undefined> {
//   if (!uuid || !assessmentType) return undefined;
//
//   const fieldName = ASSESSMENT_FIELD_MAP[assessmentType];
//
//   const query = `*[_type == "profile" && uuid == $uuid && !(_id in path('drafts.**'))][0]{
//     "${fieldName}": ${fieldName} {
//       asset->{
//         _id,
//         url,
//         originalFilename,
//         size,
//         extension
//       }
//     }
//   }`;
//
//   const options = { next: { revalidate: 30 } };
//
//   try {
//     const result = await client.fetch<{
//       [key: string]: AssessmentPdfFile | null;
//     }>(query, { uuid }, options);
//
//     return result?.[fieldName] || undefined;
//   } catch (error) {
//     console.error(`Failed to fetch ${assessmentType} assessment PDF:`, error);
//     throw new Error(`Unable to fetch assessment PDF for UUID: ${uuid}`);
//   }
// }
