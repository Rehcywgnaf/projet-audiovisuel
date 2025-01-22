import { create } from 'zustand';
import { getReferencedProjects, getProjectDetails } from '../services/projectService';

const useProjectStore = create((set) => ({
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const projects = await getReferencedProjects();
      set({ projects, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  selectProject: async (projectId) => {
    set({ loading: true });
    try {
      const project = await getProjectDetails(projectId);
      set({ selectedProject: project, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useProjectStore;