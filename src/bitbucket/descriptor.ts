export const makeDescriptor = (baseUrl: string, repoUuid: string) => ({
  name: 'Atlaskid',
  description: "Addon to display a 'release queue' panel in PRs",
  baseUrl,
  key: 'atlaskid-addon-foo',
  vendor: {
    name: 'Luke Batchelor',
  },
  scopes: ['pullrequest'],
  authentication: {
    type: 'jwt',
  },
  contexts: ['personal'],
  lifecycle: {
    installed: '/bitbucket/lifecycle/installed',
    uninstalled: '/bitbucket/lifecycle/uninstalled',
  },
  modules: {
    proxy: {
      '/can-land': {
        destination:
          '/api/bitbucket/proxy/can-land?aaid={user.account_id}&pullRequestId={pullrequest.id}',
      },
      '/land': {
        destination:
          '/api/bitbucket/proxy/land?aaid={user.account_id}&pullRequestId={pullrequest.id}',
      },
      '/land-when-able': {
        destination:
          '/api/bitbucket/proxy/land-when-able?aaid={user.account_id}&pullRequestId={pullrequest.id}',
      },
    },
    webPanels: [
      {
        weight: 100,
        tooltip: {
          value: 'Packages to be released in this PR',
        },
        key: 'atlaskid-addon-panel',
        name: {
          value: 'Release queue',
        },
        url:
          '/bitbucket/index.html?repoOwner={pullrequest.source.repository.owner.username}&repoSlug={pullrequest.source.repository.name}&pullRequestId={pullrequest.id}&username={user.username}&userUuid={user.uuid}&state={pullrequest.state}&commit={pullrequest.source.commit.hash}&title={pullrequest.title}',
        location: 'org.bitbucket.pullrequest.overview.informationPanel',
        conditions: [
          {
            condition: 'has_permission',
            params: {
              permission: 'write',
            },
          },
          {
            condition: 'equals',
            target: 'repository.uuid',
            params: {
              value: repoUuid,
            },
          },
        ],
      },
    ],
    webhooks: [
      {
        event: 'repo:commit_status_updated',
        url: '/bitbucket/webhook/status-updated',
      },
    ],
  },
});