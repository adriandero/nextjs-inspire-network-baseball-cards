export const structure = (S: any) =>
  S.list()
    .title('Baseball Card Data')
    .items([
      ...S.documentTypeListItems().filter(
        (listItem: any) =>
          !['siteSettings', 'navigation', 'colors', 'team', 'profile'].includes(listItem.getId()),
      ),
      S.divider(),

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
                  S.listItem()
                    .title('Team Settings')
                    .child(S.document().schemaType('team').documentId(teamId)),

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

      S.listItem()
        .title('Teamless Profiles')
        .child(
          S.documentList()
            .title('Teamless Profiles')
            .filter('_type == "profile" && !defined(team)'),
        ),
    ])
