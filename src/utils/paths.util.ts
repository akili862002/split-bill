export const paths = {
  home: () => "/",
  addProject: () => "/add-project",
  project: (slug: string) => `/project/${slug}`,
  addUser: (projectId: string) => `/project/${projectId}/member`,
  editUser: (projectId: string, userId: string) =>
    `/project/${projectId}/member/edit/${userId}`,
  addBill: (projectId: string) => `/project/${projectId}/bill`,
  editBill: (projectId: string, billId: string) =>
    `/project/${projectId}/bill/edit/${billId}`,
  pay: (projectId: string) => `/project/${projectId}/pay`,
};
