export const structure = (S: any) =>
  S.list()
    .title('Baseball Card Data')
    .items([
      // Filter out specific document types
      ...S.documentTypeListItems().filter(
        (listItem: any) =>
          !['siteSettings', 'navigation', 'colors', 'team', 'profile'].includes(listItem.getId()),
      ),
      S.divider(),

      // Create a list item for teams
      S.listItem()
        .title('Teams')
        .child(
          S.documentList()
            .title('Teams')
            .filter('_type == "team"')
            .child((teamId: any) =>
              S.list()
                .title('Team Details')
                .items([
                  // Team settings
                  S.listItem()
                    .title('Team Settings')
                    .child(S.document().schemaType('team').documentId(teamId)),

                  // Team members
                  S.listItem()
                    .title('Team Members')
                    .child(
                      S.documentList()
                        .title('Team Members')
                        .filter('_type == "profile" && $teamId in team[]._ref')
                        .params({teamId}),
                    ),
                ]),
            ),
        ),

      // Add a section for profiles without teams
      S.listItem()
        .title('Teamless Profiles')
        .child(
          S.documentList()
            .title('Teamless Profiles')
            .filter('_type == "profile" && !defined(team)'),
        ),
    ])
