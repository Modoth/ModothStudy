
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Cryptography;
using System.Text;
using ModothStudy.Entity;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.EntityServices;
using ModothStudy.ServiceInterface.Lang;

namespace ModothStudy.Service.Common
{
    using ExpNode = Expression<Func<Node, bool>>;

    public class ExpressionParameterReplacer : ExpressionVisitor
    {
        private IDictionary<ParameterExpression, ParameterExpression> ParameterReplacements { get; set; }

        public ExpressionParameterReplacer
        (IList<ParameterExpression> fromParameters, IList<ParameterExpression> toParameters)
        {
            ParameterReplacements = new Dictionary<ParameterExpression, ParameterExpression>();

            for (int i = 0; i != fromParameters.Count && i != toParameters.Count; i++)
            { ParameterReplacements.Add(fromParameters[i], toParameters[i]); }
        }

        protected override Expression VisitParameter(ParameterExpression node)
        {
            ParameterExpression replacement;

            if (ParameterReplacements.TryGetValue(node, out replacement))
            { node = replacement; }

            return base.VisitParameter(node);
        }
    }

    public static class ExpressionUtils
    {
        public static Expression<Func<T, Boolean>> OrElse<T>(this Expression<Func<T, Boolean>> left, Expression<Func<T, Boolean>> right)
        {
            Expression<Func<T, Boolean>> combined = Expression.Lambda<Func<T, Boolean>>(
                Expression.OrElse(
                    left.Body,
                    new ExpressionParameterReplacer(right.Parameters, left.Parameters).Visit(right.Body)
                    ), left.Parameters);

            return combined;
        }

        public static Expression<Func<T, Boolean>> AndAlso<T>(this Expression<Func<T, Boolean>> left, Expression<Func<T, Boolean>> right)
        {
            Expression<Func<T, Boolean>> combined = Expression.Lambda<Func<T, Boolean>>(
                Expression.AndAlso(
                    left.Body,
                    new ExpressionParameterReplacer(right.Parameters, left.Parameters).Visit(right.Body)
                    ), left.Parameters);

            return combined;
        }
        public static Expression<Func<T, Boolean>> Not<T>(this Expression<Func<T, Boolean>> left)
        {
            Expression<Func<T, Boolean>> combined = Expression.Lambda<Func<T, Boolean>>(
                Expression.Not(
                    left.Body
                    ), left.Parameters);

            return combined;
        }
    }
    public class NodeQueryCompileServiceSingleton : INodeQueryCompileService
    {
        private ExpNode GetCondition(Condition cond)
        {
            switch (cond.Type)
            {
                case ConditionType.And:
                    {
                        if (cond.Children == null || cond.Children.Length == 0)
                        {
                            throw new ServiceException(nameof(ServiceMessages.InvalidQuery));

                        }
                        var childrens = cond.Children.Select(c => this.GetCondition(c)).ToArray();
                        var andExp = childrens[0];
                        for (var i = 1; i < childrens.Length; i++)
                        {
                            andExp = andExp.AndAlso(childrens[i]);
                        }
                        return andExp;
                    }
                case ConditionType.Or:
                    {
                        if (cond.Children == null || cond.Children.Length == 0)
                        {
                            throw new ServiceException(nameof(ServiceMessages.InvalidQuery));

                        }
                        var childrens = cond.Children.Select(c => this.GetCondition(c)).ToArray();
                        var orExp = childrens[0];
                        for (var i = 1; i < childrens.Length; i++)
                        {
                            orExp = orExp.OrElse(childrens[i]);
                        }
                        return orExp;
                    }
                case ConditionType.Not:
                    {
                        if (cond.Children == null || cond.Children.Length == 0)
                        {
                            throw new ServiceException(nameof(ServiceMessages.InvalidQuery));

                        }
                        var childrens = cond.Children.Select(c => this.GetCondition(c)).ToArray();
                        var andExp = childrens[0];
                        for (var i = 1; i < childrens.Length; i++)
                        {
                            andExp = andExp.OrElse(childrens[i]);
                        }
                        return andExp.Not();
                    }
            }
            if (String.IsNullOrWhiteSpace(cond.Prop))
            {
                throw new ServiceException(nameof(ServiceMessages.InvalidQuery));

            }
            if (cond.Type == ConditionType.Has)
            {
                return node => node.Tags.Any(t => t.Tag!.Name == cond.Prop);
            }
            if (String.IsNullOrWhiteSpace(cond.Value))
            {
                throw new ServiceException(nameof(ServiceMessages.InvalidQuery));

            }
            switch (cond.Type)
            {
                case ConditionType.Equal:
                    {
                        var propEqual = GetPropEqual(cond.Prop!, cond.Value!);
                        if (propEqual != null)
                        {
                            return propEqual!;
                        }
                        return node => node.Tags.Any(t => t.Tag!.Name == cond.Prop && t.Value == cond.Value);
                    }
                case ConditionType.Contains:
                    {
                        var propContain = GetPropContain(cond.Prop!, cond.Value!);
                        if (propContain != null)
                        {
                            return propContain!;
                        }
                        return node => node.Tags.Any(t => t.Tag!.Name == cond.Prop && t.Value != null && t.Value.Contains(cond.Value));
                    }

            }
            throw new ServiceException(nameof(ServiceMessages.InvalidQuery));
        }

        private ExpNode? GetPropContain(string prop, string value)
        {
            switch (prop)
            {
                case nameof(Node.Name):
                    return node => node.Name!.Contains(value);
                case nameof(Node.Path):
                    return node => node.Path!.Contains(value);
            }
            return null;

        }

        private ExpNode? GetPropEqual(string prop, string value)
        {
            switch (prop)
            {
                case nameof(Node.Name):
                    return node => node.Name == value;
                case nameof(Node.Type):
                    return node => node.Type == value;
            }
            return null;

        }
        public ExpNode Compile(IEnumerable<NodeParentId>? ins, Query? query)
        {
            try
            {
                ExpNode? exp = node => true;
                if (ins != null)
                {
                    exp = default;
                    foreach (var p in ins)
                    {
                        ExpNode inExp = node => node.Path!.StartsWith(p.Path) && node.User!.Id == p.UserId;
                        exp = exp == null ? inExp : exp.OrElse(inExp);
                    }
                }
                if (exp == null)
                {
                    throw new ServiceException(nameof(ServiceMessages.InvalidQuery));
                }
                if (query == null)
                {
                    return exp!;
                }
                if (query.Where != null)
                {
                    ExpNode condExp = GetCondition(query.Where);
                    exp = exp.AndAlso(condExp);
                }
                return exp!;
            }
            catch
            {
                throw new ServiceException(nameof(ServiceMessages.InvalidQuery));
            }

        }
    }
}