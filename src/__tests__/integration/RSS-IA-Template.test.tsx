${previousContent}
    .getByTestId("deadline")).toHaveTextContent("2025-03-01");
      expect(screen.getByTestId("budget")).toHaveTextContent("50000");
      expect(screen.getByTestId("complexity")).toHaveTextContent("medium");
    });
  });

  test('Performance du rendu avec données complètes', async () => {
    const startTime = performance.now();

    await act(async () => {
      render(
        <>
          <TemplateUI />
          <TemplateFeatures />
          <PermissionChecker />
        </>
      );
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Le rendu ne devrait pas prendre plus de 200ms
    expect(renderTime).toBeLessThan(200);

    // Vérification du chargement asynchrone correct
    await waitFor(() => {
      expect(screen.getByTestId("template-ready")).toHaveAttribute('data-status', 'complete');
    });
  });
});

// Tests spécifiques pour la nouvelle structure modulaire du TemplateManager
describe('TemplateManager Structure Modulaire', () => {
  test('TemplateUI - Interface utilisateur de base', async () => {
    render(<TemplateUI />);
    
    // Vérification des éléments UI de base
    expect(screen.getByTestId("template-form")).toBeInTheDocument();
    expect(screen.getByTestId("template-preview")).toBeInTheDocument();
  });

  test('TemplateFeatures - Gestion des fonctionnalités IA', async () => {
    render(<TemplateFeatures />);
    
    // Vérification des fonctionnalités IA
    expect(screen.getByTestId("ai-suggestions")).toBeInTheDocument();
    expect(screen.getByTestId("ai-analysis")).toBeInTheDocument();
  });

  test('PermissionChecker - Logique de permissions', async () => {
    render(<PermissionChecker />);
    
    // Vérification de la gestion des permissions
    expect(screen.getByTestId("permission-controls")).toBeInTheDocument();
    expect(screen.getByTestId("access-level")).toBeInTheDocument();
  });
});
